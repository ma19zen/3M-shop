module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { type, to, data } = req.body;

    if (!type || !to) {
      return res.status(400).json({ success: false, message: 'type and to are required' });
    }

    let subject, body;

    switch (type) {
      case 'order_confirmation':
        subject = `Order Confirmed - #${data?.orderId || 'N/A'}`;
        body = `Hi ${data?.customerName || 'Customer'}, your order #${data?.orderId} has been confirmed. Total: $${data?.total || '0.00'}`;
        break;
      case 'welcome':
        subject = 'Welcome to ShopSphere!';
        body = `Hi ${data?.name || 'User'}, welcome to ShopSphere! We're excited to have you.`;
        break;
      case 'order_shipped':
        subject = `Order Shipped - #${data?.orderId || 'N/A'}`;
        body = `Hi ${data?.customerName || 'Customer'}, your order #${data?.orderId} has been shipped.`;
        break;
      default:
        subject = 'ShopSphere Notification';
        body = `Notification: ${type}`;
    }

    const notificationLog = {
      id: `notif_${Date.now()}`,
      type,
      to,
      subject,
      body,
      status: 'sent',
      timestamp: new Date().toISOString(),
    };

    console.log('Email sent:', JSON.stringify(notificationLog));

    res.status(200).json({
      success: true,
      message: 'Notification sent successfully',
      data: notificationLog,
    });
  } catch (error) {
    console.error('Notification error:', error);
    res.status(500).json({ success: false, message: 'Failed to send notification', error: error.message });
  }
};
