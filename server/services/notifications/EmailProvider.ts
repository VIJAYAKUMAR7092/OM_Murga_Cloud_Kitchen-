import { Resend } from 'resend';
import { EmailTemplates } from './templates/EmailTemplates';

export class EmailProvider {
  private resend: Resend | null = null;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      this.resend = new Resend(apiKey);
    } else {
      console.warn("RESEND_API_KEY not configured. Emails will be skipped.");
    }
  }

  private getFromEmail() {
    return process.env.RESEND_FROM_EMAIL || 'orders@ommuruga.com';
  }

  async sendAdminNewOrder(order: any, adminEmail: string) {
    if (!this.resend || !adminEmail) return false;
    
    try {
      await this.resend.emails.send({
        from: `Om Muruga Orders <${this.getFromEmail()}>`,
        to: adminEmail,
        subject: `New Order Received - #${order.orderNumber}`,
        html: EmailTemplates.getAdminNewOrderEmail(order),
      });
      return true;
    } catch (error) {
      console.error("EmailProvider: Failed to send admin email", error);
      return false;
    }
  }

  async sendCustomerOrderConfirmation(order: any, settings: any) {
    if (!this.resend || !order.email) return false;
    
    try {
      await this.resend.emails.send({
        from: `${settings.restaurantName} <${this.getFromEmail()}>`,
        to: order.email,
        subject: `Order Confirmation - #${order.orderNumber}`,
        html: EmailTemplates.getCustomerOrderEmail(order, settings),
      });
      return true;
    } catch (error) {
      console.error("EmailProvider: Failed to send customer email", error);
      return false;
    }
  }

  async sendCustomerStatusUpdate(order: any, settings: any) {
    if (!this.resend || !order.email) return false;
    
    try {
      await this.resend.emails.send({
        from: `${settings.restaurantName} <${this.getFromEmail()}>`,
        to: order.email,
        subject: `Order Update - #${order.orderNumber} - ${order.orderStatus}`,
        html: EmailTemplates.getOrderStatusEmail(order, settings),
      });
      return true;
    } catch (error) {
      console.error("EmailProvider: Failed to send customer status email", error);
      return false;
    }
  }
}
