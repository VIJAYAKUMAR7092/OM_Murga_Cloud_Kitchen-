export class WhatsAppProvider {
  private apiUrl: string;
  private token: string;

  constructor() {
    // Official Meta Cloud API setup
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
    this.apiUrl = `https://graph.facebook.com/v17.0/${phoneNumberId}/messages`;
    this.token = process.env.WHATSAPP_TOKEN || '';
  }

  private async sendMessage(to: string, messageText: string) {
    console.log('\n--- WHATSAPP PROVIDER DEBUG ---');
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    console.log(`WHATSAPP_TOKEN exists? ${!!this.token}`);
    console.log(`PHONE_NUMBER_ID exists? ${!!phoneNumberId}`);
    
    if (!this.token) console.log("Missing: WHATSAPP_TOKEN");
    if (!phoneNumberId) console.log("Missing: WHATSAPP_PHONE_NUMBER_ID");

    console.log(`Graph URL: ${this.apiUrl}`);
    console.log(`Destination Number (Raw): ${to}`);
    
    if (!this.token || !this.apiUrl || this.apiUrl.includes('v17.0//messages')) {
      // If token isn't configured, just log to console (useful for development)
      console.log(`[WhatsApp Mock]\nTo: ${to}\nMessage: ${messageText}\n`);
      return true;
    }

    try {
      // Formatting the number: assuming Indian numbers, strip everything and add 91 if length is 10
      const cleanNumber = to.replace(/\D/g, '');
      const formattedNumber = cleanNumber.length === 10 ? `91${cleanNumber}` : cleanNumber;
      console.log(`Destination Number (Formatted): ${formattedNumber}`);

      const payload = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: formattedNumber,
        type: "text",
        text: {
          preview_url: false,
          body: messageText
        }
      };
      
      console.log('Complete Payload Before Fetch:', JSON.stringify(payload, null, 2));

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      console.log(`After fetch()`);
      console.log(`Status Code: ${response.status}`);
      console.log(`Status Text: ${response.statusText}`);

      if (!response.ok) {
        const errorData = await response.json();
        console.log(`Response Body (Error):`, JSON.stringify(errorData, null, 2));
        console.error("WhatsAppProvider API Error:", errorData);
        return false;
      }
      
      const successData = await response.json();
      console.log(`Response Body (Success):`, JSON.stringify(successData, null, 2));
      return true;
    } catch (error) {
      console.error("WhatsAppProvider request failed:", error);
      return false;
    }
  }

  private formatOrderItems(items: any[]) {
    return items.map((i: any) => `- ${i.quantity}x ${i.food.name} (₹${i.price * i.quantity})`).join('\\n');
  }

  async sendAdminNewOrder(order: any, adminPhone: string) {
    if (!adminPhone) return false;
    
    const text = 
      `🚨 *NEW ORDER RECEIVED* 🚨\\n\\n` +
      `*Order #:* ${order.orderNumber}\\n` +
      `*Customer:* ${order.customerName}\\n` +
      `*Phone:* ${order.phone}\\n` +
      `*Payment:* ${order.paymentMethod}\\n\\n` +
      `*Items:*\\n${this.formatOrderItems(order.items)}\\n\\n` +
      `*Total:* ₹${order.total}\\n\\n` +
      `*Delivery Address:*\\n${order.houseNumber}, ${order.formattedAddress}\\n` +
      (order.landmark ? `*Landmark:* ${order.landmark}\\n` : '');

    return this.sendMessage(adminPhone, text);
  }

  async sendCustomerOrderConfirmation(order: any, settings: any, customerPhone: string) {
    if (!customerPhone) return false;

    const text = 
      `Hi ${order.customerName},\\n\\n` +
      `Thank you for ordering from *${settings.restaurantName}*! 🎉\\n\\n` +
      `*Order #:* ${order.orderNumber}\\n` +
      `*Payment:* ${order.paymentMethod}\\n\\n` +
      `*Your Items:*\\n${this.formatOrderItems(order.items)}\\n\\n` +
      `*Grand Total:* ₹${order.total}\\n\\n` +
      `We have received your order and it will be prepared soon. You will receive another message when it is out for delivery.`;

    return this.sendMessage(customerPhone, text);
  }

  async sendCustomerStatusUpdate(order: any, settings: any, customerPhone: string) {
    if (!customerPhone) return false;

    let statusText = "";
    switch(order.orderStatus) {
      case "ACCEPTED": statusText = "has been *ACCEPTED* and is being prepared! 🍳"; break;
      case "PREPARING": statusText = "is currently *PREPARING*! 🔥"; break;
      case "OUT_FOR_DELIVERY": statusText = "is *OUT FOR DELIVERY*! 🛵"; break;
      case "DELIVERED": statusText = "has been *DELIVERED*! Enjoy your meal! 😋"; break;
      case "CANCELLED": statusText = "has been *CANCELLED*. Please contact support if this was a mistake."; break;
      default: return false;
    }

    const text = `Hi ${order.customerName},\\n\\nUpdate from *${settings.restaurantName}*:\\nYour order (#${order.orderNumber}) ${statusText}`;
    return this.sendMessage(customerPhone, text);
  }
}
