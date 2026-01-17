import Event from "../models/Event.js";
import EventApplication from "../models/EventApplication.js";
import Attendance from "../models/Attendance.js";
import OrgCertificateTemplate from "../models/OrgCertificateTemplate.js";
import pdf from "html-pdf-node"; 
import path from "path";
import User from "../models/User.js";
import fs from "fs";

// Get volunteer eligible events for certificates
export const getEligibleEvents = async (req, res) => {
  try {
    const volunteerId = req.user.id;

    // Get approved event applications
    const applications = await EventApplication.find({
      userId: volunteerId,
      status: "approved"
    }).populate("eventId");

    const eligible = [];

    for (const app of applications) {
      const event = app.eventId;

      // Count days attended
      const attendedDays = await Attendance.countDocuments({
        eventId: event._id,
        volunteerId
      });

      if (attendedDays >= event.minDay) {
        // Get organization-selected template
        const orgTemplate = await OrgCertificateTemplate.findOne({
          orgId: event.createdBy,
          isActive: true
        }).populate("templateId");

        eligible.push({
          eventId: event._id,
          eventName: event.eventName,
          orgTemplate
        });
      }
    }

    res.json(eligible);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch eligible events" });
  }
};

export const generateCertificate = async (req, res) => {
  try {
    const { eventId } = req.params;
    const volunteerId = req.user.id;

    const application = await EventApplication
      .findOne({ eventId, userId: volunteerId })
      .populate("eventId");

    if (!application) {
      return res.status(404).json({ message: "Event not found" });
    }

    const attendedDays = await Attendance.countDocuments({
      eventId,
      volunteerId,
    });

    if (attendedDays < application.eventId.minDay) {
      return res
        .status(400)
        .json({ message: "Minimum days requirement not met" });
    }

    const orgTemplate = await OrgCertificateTemplate
      .findOne({
        orgId: application.eventId.createdBy,
        isActive: true,
      })
      .populate("templateId");

    const orgUser = await User.findById(application.eventId.createdBy);

    if (!orgTemplate) {
      return res
        .status(404)
        .json({ message: "No template selected by organization" });
    }

    /* -------------------- TEMPLATE CSS -------------------- */
    const printCSS = `
      <style>
        @page { size: A4; margin: 0; }
        html, body { width: 210mm; height: 297mm; margin: 0; padding: 0; }
      </style>
    `;

    let html = printCSS + orgTemplate.templateId.htmlTemplate;

    /* -------------------- PLACEHOLDERS -------------------- */
    html = html.replace(/{{\s*volunteerName\s*}}/gi, application.name);
    html = html.replace(/{{\s*eventName\s*}}/gi, application.eventId.eventName);
    html = html.replace(/{{\s*organizationName\s*}}/gi, orgUser.name);
    html = html.replace(/{{\s*location\s*}}/gi, application.eventId.location);
    html = html.replace(/{{\s*city\s*}}/gi, application.eventId.city);
    html = html.replace(
      /{{\s*startDate\s*}}/gi,
      new Date(application.eventId.startDate).toLocaleDateString()
    );
    html = html.replace(
      /{{\s*endDate\s*}}/gi,
      new Date(application.eventId.endDate).toLocaleDateString()
    );
    html = html.replace(/{{\s*daysVolunteered\s*}}/gi, attendedDays);

    /* -------------------- SIGNATURE -------------------- */
    let signatureImg = "";

    if (orgTemplate.signature) {
      const signaturePath = path.join(process.cwd(), orgTemplate.signature);

      if (fs.existsSync(signaturePath)) {
        const fileData = fs.readFileSync(signaturePath);
        const ext = path.extname(signaturePath).substring(1);
        signatureImg = `data:image/${ext};base64,${fileData.toString("base64")}`;
      }
    }

    html = html.replace(
      /{{\s*signature\s*}}/gi,
      signatureImg
        ? `<img src="${orgTemplate.signature}" style="height:60px; display:block; margin:0 auto 10px auto;" />`
        : ""
    );

    html = html.replace(
      /{{\s*currentDate\s*}}/gi,
      new Date().toLocaleDateString()
    );

    /* -------------------- PDF GENERATION USING html-pdf-node -------------------- */
    const file = { content: html };
    const options = {
      format: 'A4',
      landscape: true,
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    };

const pdfBuffer = await pdf.generatePdf(file, options);


    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${application.eventId.eventName}-certificate.pdf"`,
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to generate certificate" });
  }
};