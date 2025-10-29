import 'dotenv/config'
import Brevo from '@getbrevo/brevo'

export async function sendPurchaseEmail(userEmail, purchasedData) {  

    const { date, amount_paid, price_per_oz, gold_sold } = purchasedData

    const brevo = new Brevo.TransactionalEmailsApi()

    brevo.setApiKey(
      Brevo.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY
    )

    const emailData = {
        sender: { name: 'Gold Investment Co.', email: process.env.APPTESTER_EMAIL_USER },
        to: [{ email: userEmail }],
        subject: "Your Gold Purchase Confirmation 🪙",
        htmlContent: `
          <div style="
            font-family: 'Segoe UI', Arial, sans-serif;
            color: #2b2b2b;
            background: #f8f6f1;
            padding: 20px;
            border-radius: 12px;
            max-width: 500px;
            margin: auto;
            border: 1px solid #e0c97f;
          ">
            <h2 style="text-align: center; color: goldenrod;">Gold Purchase Confirmation</h2>

            <p>Dear Valued Investor,</p>

            <p>Thank you for your recent <strong>gold purchase</strong> with <b>Gold Investment Co.</b></p>

            <table style="
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
              font-size: 15px;
            ">
              <tr>
                <td style="padding: 6px 0;"><b>Date:</b></td>
                <td>${new Date(date).toLocaleString()}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0;"><b>Amount Paid:</b></td>
                <td>${amount_paid}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0;"><b>Price per Ounce:</b></td>
                <td>${price_per_oz}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0;"><b>Gold Purchased:</b></td>
                <td>${gold_sold}</td>
              </tr>
            </table>

            <p style="margin-top: 15px;">
              You will receive your official documentation shortly.
            </p>

            <p style="margin-top: 10px;">
              Warm regards,<br/>
              <strong>Gold Investment Co. Team</strong>
            </p>

            <hr style="border:none;border-top:1px solid #ddd;margin:15px 0;"/>
            <p style="font-size: 12px; color: #777; text-align:center;">
              This message was automatically generated. Please do not reply.
            </p>
          </div>
       `,
    }

      await brevo.sendTransacEmail(emailData);

}