const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');
// Read Resend API key and sender address from environment for security
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || 'booking@komodocruises.com' || 'zenalaydrusss@gmail.com';

if (!RESEND_API_KEY) {
  console.warn('⚠️  RESEND_API_KEY is not set. Email sending will fail until you set it in the environment.');
}

const resend = new Resend(RESEND_API_KEY);

const app = express();
const PORT = process.env.PORT || 3001;

// Xendit API Key (Development)
const XENDIT_SECRET_KEY = 'xnd_development_dGXj21II2TZ60PFab6N5UDTu3SQZzC5qJpkPfoW7eoSaz2Hwvz0sw4dnD5EhM6g';

// Base64 encode for Basic Auth
const XENDIT_AUTH = Buffer.from(XENDIT_SECRET_KEY + ':').toString('base64');

// Email Configuration (Gmail SMTP)
// Untuk menggunakan Gmail, Anda perlu:
// 1. Aktifkan 2-Factor Authentication di akun Gmail
// 2. Buat App Password di https://myaccount.google.com/apppasswords
const EMAIL_USER = process.env.EMAIL_USER || 'zenalaydrusss@gmail.com';
const EMAIL_PASS = process.env.EMAIL_PASS || 'ykry gyas ciii oigu';

// Nodemailer dihapus, diganti dengan Resend

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Create Xendit Invoice using REST API directly
app.post('/api/create-invoice', async (req, res) => {
  try {
    const {
      externalId,
      amount,
      payerEmail,
      description,
      customerName,
      customerPhone,
      items,
      successRedirectUrl,
      failureRedirectUrl
    } = req.body;

    console.log('Received request body:', req.body);

    // Validate required fields
    if (!amount || !payerEmail || !description) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${!amount ? 'amount' : ''} ${!payerEmail ? 'payerEmail' : ''} ${!description ? 'description' : ''}`.trim()
      });
    }

    // Generate external ID if not provided
    const invoiceExternalId = externalId || `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Prepare invoice data for Xendit API
    const invoiceData = {
      external_id: invoiceExternalId,
      amount: Number(amount),
      payer_email: payerEmail,
      description: description,
      currency: 'IDR',
      invoice_duration: 86400,
      success_redirect_url: successRedirectUrl || 'http://localhost:5173/payment-success',
      failure_redirect_url: failureRedirectUrl || 'http://localhost:5173/payment-failed',
    };

    // Add customer if provided
    if (customerName || customerPhone) {
      invoiceData.customer = {
        given_names: customerName || 'Customer',
        email: payerEmail,
      };
      if (customerPhone) {
        invoiceData.customer.mobile_number = customerPhone;
      }
    }

    // Add items if provided
    if (items && items.length > 0) {
      invoiceData.items = items.map(item => ({
        name: item.name,
        quantity: item.quantity || 1,
        price: item.price,
        category: item.category || 'Cruise Booking'
      }));
    }

    console.log('Creating Xendit invoice with data:', JSON.stringify(invoiceData, null, 2));

    // Call Xendit API directly
    const response = await fetch('https://api.xendit.co/v2/invoices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${XENDIT_AUTH}`
      },
      body: JSON.stringify(invoiceData)
    });

    const responseData = await response.json();
    
    console.log('Xendit API response:', responseData);

    if (!response.ok) {
      console.error('Xendit API error:', responseData);
      return res.status(response.status).json({
        success: false,
        message: responseData.message || 'Failed to create invoice',
        errorCode: responseData.error_code
      });
    }

    res.json({
      success: true,
      invoiceId: responseData.id,
      invoiceUrl: responseData.invoice_url,
      externalId: responseData.external_id,
      status: responseData.status,
      amount: responseData.amount,
      expiryDate: responseData.expiry_date
    });

  } catch (error) {
    console.error('Error creating Xendit invoice:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while creating invoice',
      error: error.message
    });
  }
});

// Get Invoice Status
app.get('/api/invoice/:invoiceId', async (req, res) => {
  try {
    const { invoiceId } = req.params;

    const response = await fetch(`https://api.xendit.co/v2/invoices/${invoiceId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${XENDIT_AUTH}`
      }
    });

    const responseData = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: responseData.message || 'Failed to fetch invoice'
      });
    }

    res.json({
      success: true,
      invoice: responseData
    });

  } catch (error) {
    console.error('Error fetching invoice:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch invoice',
      error: error.message
    });
  }
});

// Webhook endpoint for Xendit callbacks
app.post('/api/xendit-webhook', (req, res) => {
  try {
    const webhookData = req.body;
    console.log('Received Xendit webhook:', webhookData);

    // Handle different webhook events
    switch (webhookData.status) {
      case 'PAID':
        console.log(`Invoice ${webhookData.external_id} has been paid!`);
        // TODO: Update booking status in database
        break;
      case 'EXPIRED':
        console.log(`Invoice ${webhookData.external_id} has expired`);
        // TODO: Handle expired invoice
        break;
      default:
        console.log(`Invoice status: ${webhookData.status}`);
    }

    res.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Generate email HTML template
function generateEmailHTML(data) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmation - Komodo Cruises</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <tr>
      <td style="background: linear-gradient(135deg, #1a365d 0%, #2d4a6f 100%); padding: 40px 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">🚢 Komodo Cruises</h1>
        <p style="color: rgba(255,255,255,0.8); margin: 10px 0 0; font-size: 16px;">Booking Confirmation</p>
      </td>
    </tr>
    
    <!-- Success Badge -->
    <tr>
      <td style="padding: 30px 30px 20px; text-align: center;">
        <div style="display: inline-block; background-color: #dcfce7; color: #166534; padding: 12px 24px; border-radius: 50px; font-weight: 600;">
          ✓ Payment Successful
        </div>
      </td>
    </tr>
    
    <!-- Greeting -->
    <tr>
      <td style="padding: 0 30px 20px;">
        <h2 style="color: #1a365d; margin: 0 0 10px; font-size: 24px;">Thank You for Your Purchase!</h2>
        <p style="color: #64748b; margin: 0; font-size: 15px; line-height: 1.6;">
          Dear ${data.customerName},<br><br>
          Your booking has been confirmed. Below are your booking details and payment receipt.
        </p>
      </td>
    </tr>
    
    <!-- Booking ID -->
    <tr>
      <td style="padding: 0 30px 20px;">
        <table width="100%" style="background: #f8fafc; border-radius: 12px; padding: 20px;">
          <tr>
            <td style="padding: 15px;">
              <p style="margin: 0 0 5px; font-size: 12px; color: #64748b; text-transform: uppercase;">Booking ID</p>
              <p style="margin: 0; font-size: 20px; font-weight: 600; color: #1a365d; font-family: monospace;">#${data.bookingId}</p>
            </td>
            <td style="padding: 15px; text-align: right;">
              <p style="margin: 0 0 5px; font-size: 12px; color: #64748b; text-transform: uppercase;">Date</p>
              <p style="margin: 0; font-size: 16px; color: #1a365d;">${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    
    <!-- Guest Information -->
    <tr>
      <td style="padding: 0 30px 20px;">
        <h3 style="color: #1a365d; margin: 0 0 15px; font-size: 16px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">
          👤 Guest Information
        </h3>
        <table width="100%" cellpadding="8">
          <tr>
            <td style="color: #64748b; font-size: 14px; width: 120px;">Name:</td>
            <td style="color: #1e293b; font-size: 14px; font-weight: 500;">${data.customerName}</td>
          </tr>
          <tr>
            <td style="color: #64748b; font-size: 14px;">Email:</td>
            <td style="color: #1e293b; font-size: 14px; font-weight: 500;">${data.customerEmail}</td>
          </tr>
          <tr>
            <td style="color: #64748b; font-size: 14px;">Phone:</td>
            <td style="color: #1e293b; font-size: 14px; font-weight: 500;">${data.customerPhone || '-'}</td>
          </tr>
        </table>
      </td>
    </tr>
    
    <!-- Trip Details -->
    <tr>
      <td style="padding: 0 30px 20px;">
        <h3 style="color: #1a365d; margin: 0 0 15px; font-size: 16px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">
          🚢 Trip Details
        </h3>
        <table width="100%" cellpadding="8">
          <tr>
            <td style="color: #64748b; font-size: 14px; width: 120px;">Ship:</td>
            <td style="color: #1e293b; font-size: 14px; font-weight: 500;">${data.shipName}</td>
          </tr>
          <tr>
            <td style="color: #64748b; font-size: 14px;">Cabin Type:</td>
            <td style="color: #1e293b; font-size: 14px; font-weight: 500;">${data.cabinName}</td>
          </tr>
          <tr>
            <td style="color: #64748b; font-size: 14px;">Itinerary:</td>
            <td style="color: #1e293b; font-size: 14px; font-weight: 500;">${data.itinerary || '-'}</td>
          </tr>
          <tr>
            <td style="color: #64748b; font-size: 14px;">Travel Date:</td>
            <td style="color: #1e293b; font-size: 14px; font-weight: 500;">${data.travelDate}</td>
          </tr>
          <tr>
            <td style="color: #64748b; font-size: 14px;">Guests:</td>
            <td style="color: #1e293b; font-size: 14px; font-weight: 500;">${data.guests} Person(s)</td>
          </tr>
        </table>
      </td>
    </tr>
    
    <!-- Payment Summary -->
    <tr>
      <td style="padding: 0 30px 20px;">
        <h3 style="color: #1a365d; margin: 0 0 15px; font-size: 16px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">
          💳 Payment Summary
        </h3>
        <table width="100%" style="background: #f8fafc; border-radius: 12px;">
          <tr>
            <td style="padding: 15px; color: #64748b; font-size: 14px;">${data.cabinName} × ${data.guests}</td>
            <td style="padding: 15px; color: #1e293b; font-size: 14px; text-align: right;">${formatCurrency(data.pricePerCabin)} × ${data.guests}</td>
          </tr>
          <tr>
            <td colspan="2" style="border-top: 2px dashed #e2e8f0;"></td>
          </tr>
          <tr>
            <td style="padding: 15px; color: #1a365d; font-size: 16px; font-weight: 600;">Total Paid</td>
            <td style="padding: 15px; color: #10b981; font-size: 22px; font-weight: 700; text-align: right;">${formatCurrency(data.totalAmount)}</td>
          </tr>
        </table>
        <div style="background: #dcfce7; color: #166534; padding: 12px; border-radius: 8px; text-align: center; margin-top: 15px; font-weight: 600;">
          ✓ Payment Successful
        </div>
      </td>
    </tr>
    
    <!-- What's Next -->
    <tr>
      <td style="padding: 0 30px 30px;">
        <h3 style="color: #1a365d; margin: 0 0 15px; font-size: 16px;">What Happens Next?</h3>
        <table width="100%">
          <tr>
            <td style="padding: 10px 0;">
              <table>
                <tr>
                  <td style="background: #c99b7b; color: white; width: 28px; height: 28px; border-radius: 50%; text-align: center; font-weight: 600; font-size: 14px;">1</td>
                  <td style="padding-left: 12px; color: #475569; font-size: 14px;">Our Journey Designer will contact you within 24 hours</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0;">
              <table>
                <tr>
                  <td style="background: #c99b7b; color: white; width: 28px; height: 28px; border-radius: 50%; text-align: center; font-weight: 600; font-size: 14px;">2</td>
                  <td style="padding-left: 12px; color: #475569; font-size: 14px;">We'll finalize your itinerary and travel arrangements</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0;">
              <table>
                <tr>
                  <td style="background: #c99b7b; color: white; width: 28px; height: 28px; border-radius: 50%; text-align: center; font-weight: 600; font-size: 14px;">3</td>
                  <td style="padding-left: 12px; color: #475569; font-size: 14px;">Get ready for an unforgettable adventure!</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    
    <!-- Footer -->
    <tr>
      <td style="background: #1a365d; padding: 30px; text-align: center;">
        <p style="color: rgba(255,255,255,0.8); margin: 0 0 10px; font-size: 14px;">Need help? Contact us at</p>
        <a href="mailto:support@komodocruises.com" style="color: #c99b7b; text-decoration: none; font-weight: 500;">support@komodocruises.com</a>
        <p style="color: rgba(255,255,255,0.5); margin: 20px 0 0; font-size: 12px;">© ${new Date().getFullYear()} Komodo Cruises. All rights reserved.</p>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

// Send confirmation email endpoint
app.post('/api/send-confirmation-email', async (req, res) => {
  try {
    const data = req.body || {};

    // Basic validation
    if (!data.customerEmail) {
      return res.status(400).json({ success: false, message: 'Missing required field: customerEmail' });
    }

    console.log('Sending confirmation email to:', data.customerEmail);

    // Ensure API key present
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured in the environment.');
      return res.status(500).json({ success: false, message: 'Email provider not configured' });
    }

    const response = await resend.emails.send({
      from: EMAIL_FROM,
      to: data.customerEmail,
      subject: `✅ Booking Confirmed - ${data.bookingId || ''} | Komodo Cruises`,
      html: generateEmailHTML(data)
    });

    // Resend SDK may return different shapes; try to extract an id safely
    const sentId = response && (response.id || (response.data && response.data.id));

    console.log('Resend response:', response);

    return res.json({ success: true, message: 'Email sent successfully', id: sentId || null, raw: response });
  } catch (error) {
    console.error('Error sending email:', error);

    // If Resend returned a structured error, try to forward useful info
    const errMsg = error && (error.message || (error.error && error.error.message)) || 'Unknown error';

    return res.status(500).json({
      success: false,
      message: 'Failed to send email',
      error: errMsg,
      details: error
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📋 API endpoints:`);
  console.log(`   POST /api/create-invoice - Create Xendit invoice`);
  console.log(`   GET  /api/invoice/:id - Get invoice status`);
  console.log(`   POST /api/xendit-webhook - Xendit webhook`);
  console.log(`   POST /api/send-confirmation-email - Send confirmation email`);
});
