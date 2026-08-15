export const EmailTemplates = {
  getAdminNewOrderEmail: (order: any) => `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #000; color: #fff; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #111; padding: 20px; border-radius: 8px; border: 1px solid #D4AF37; }
          .header { color: #D4AF37; font-size: 24px; font-weight: bold; margin-bottom: 20px; text-align: center; }
          .detail { margin-bottom: 10px; }
          .detail strong { color: #D4AF37; }
          .items { margin-top: 20px; border-top: 1px solid #333; padding-top: 20px; }
          .item { display: flex; justify-content: space-between; margin-bottom: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">New Order Received! #${order.orderNumber}</div>
          <div class="detail"><strong>Customer Name:</strong> ${order.customerName}</div>
          <div class="detail"><strong>Phone:</strong> ${order.phone}</div>
          <div class="detail"><strong>Payment Method:</strong> ${order.paymentMethod}</div>
          <div class="detail"><strong>Address:</strong> ${order.houseNumber}, ${order.formattedAddress}</div>
          
          <div class="items">
            <strong>Items:</strong>
            ${order.items.map((i: any) => `<div class="item"><span>${i.quantity}x ${i.food.name}</span> <span>₹${i.price * i.quantity}</span></div>`).join('')}
          </div>
          
          <div style="margin-top: 20px; border-top: 1px solid #D4AF37; padding-top: 10px; text-align: right; font-size: 18px; color: #D4AF37; font-weight: bold;">
            Grand Total: ₹${order.total}
          </div>
        </div>
      </body>
    </html>
  `,

  getCustomerOrderEmail: (order: any, settings: any) => `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; color: #333; }
          .container { max-width: 600px; margin: 0 auto; background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { max-width: 150px; margin-bottom: 10px; }
          .title { font-size: 24px; font-weight: bold; color: #000; }
          .subtitle { font-size: 16px; color: #666; }
          .detail-box { background: #fafafa; padding: 15px; border-radius: 6px; margin-bottom: 20px; }
          .items { margin-top: 20px; border-top: 2px solid #eee; padding-top: 20px; }
          .item { display: flex; justify-content: space-between; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #eee; }
          .total { text-align: right; font-size: 20px; font-weight: bold; margin-top: 20px; color: #000; }
          .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #999; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="title">${settings.restaurantName}</div>
            <div class="subtitle">Thank you for your order!</div>
          </div>
          
          <div class="detail-box">
            <p><strong>Order Number:</strong> #${order.orderNumber}</p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
            <p><strong>Delivery Address:</strong> ${order.houseNumber}, ${order.formattedAddress}</p>
          </div>
          
          <div class="items">
            ${order.items.map((i: any) => `<div class="item"><span>${i.quantity}x ${i.food.name}</span> <span>₹${i.price * i.quantity}</span></div>`).join('')}
          </div>
          
          <div class="total">
            Grand Total: ₹${order.total}
          </div>
          
          <div class="footer">
            <p>We are preparing your order. You will receive an update once it's out for delivery.</p>
            <p>&copy; ${new Date().getFullYear()} ${settings.restaurantName}. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `,
  
  getOrderStatusEmail: (order: any, settings: any) => `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; color: #333; }
          .container { max-width: 600px; margin: 0 auto; background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { text-align: center; margin-bottom: 30px; }
          .title { font-size: 24px; font-weight: bold; color: #000; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="title">${settings.restaurantName}</div>
          </div>
          <p>Hi ${order.customerName},</p>
          <p>Your order <strong>#${order.orderNumber}</strong> status has been updated to: <strong>${order.orderStatus}</strong></p>
          ${order.orderStatus === 'OUT_FOR_DELIVERY' ? '<p>Your food is on the way!</p>' : ''}
          ${order.orderStatus === 'DELIVERED' ? '<p>Enjoy your meal!</p>' : ''}
        </div>
      </body>
    </html>
  `
};
