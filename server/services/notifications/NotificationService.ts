import { EmailProvider } from './EmailProvider';
import { WhatsAppProvider } from './WhatsAppProvider';
import { prisma } from '@/lib/prisma';

class NotificationService {
  private emailProvider: EmailProvider;
  private whatsappProvider: WhatsAppProvider;

  constructor() {
    this.emailProvider = new EmailProvider();
    this.whatsappProvider = new WhatsAppProvider();
  }

  /**
   * Called immediately after a successful COD or Online order creation
   */
  async sendOrderCreatedAlert(order: any, settings: any) {
    try {
      const customerPhone = order.whatsapp || order.phone;
      console.log(`\nCustomer Phone: ${customerPhone}`);
      console.log(`Admin Phone: ${settings.phone}`);
      console.log(`Customer Email: ${order.email}`);
      console.log(`Admin Email: ${settings.email}\n`);

      // 1. Notify Customer via WhatsApp
      if (customerPhone) {
        await this.whatsappProvider.sendCustomerOrderConfirmation(order, settings, customerPhone);
      }

      // 2. Notify Customer via Email
      if (order.email) {
        await this.emailProvider.sendCustomerOrderConfirmation(order, settings);
      }

      // 3. Notify Admin via WhatsApp (REMOVED FOR PHASE 32)
      // if (settings.phone) {
      //   await this.whatsappProvider.sendAdminNewOrder(order, settings.phone);
      // }

      // 4. Notify Admin via Email
      if (settings.email) {
        await this.emailProvider.sendAdminNewOrder(order, settings.email);
      }

      // 5. Create In-App Admin Notification
      await prisma.notification.create({
        data: {
          title: "New Order Received",
          message: `Order #${order.orderNumber} for ₹${order.total} from ${order.customerName}`,
          type: "NEW_ORDER",
          relatedOrderId: order.id,
        }
      });
    } catch (error) {
      // Never throw errors back to the checkout flow
      console.error("NotificationService.sendOrderCreatedAlert failed silently:", error);
    }
  }

  /**
   * Called when admin changes the order status
   */
  async sendOrderStatusUpdate(order: any, settings: any) {
    try {
      if (order.orderStatus === 'PENDING') return; // Don't notify on default state

      // 1. Notify Customer via WhatsApp
      const customerPhone = order.whatsapp || order.phone;
      if (customerPhone) {
        await this.whatsappProvider.sendCustomerStatusUpdate(order, settings, customerPhone);
      }

      // 2. Notify Customer via Email
      if (order.email) {
        await this.emailProvider.sendCustomerStatusUpdate(order, settings);
      }

      // 3. Admin Notification for CANCELLED
      if (order.orderStatus === 'CANCELLED') {
        await prisma.notification.create({
          data: {
            title: "Order Cancelled",
            message: `Order #${order.orderNumber} has been cancelled.`,
            type: "ORDER_CANCELLED",
            relatedOrderId: order.id,
          }
        });
      }
    } catch (error) {
      console.error("NotificationService.sendOrderStatusUpdate failed silently:", error);
    }
  }

  /**
   * Called when a new contact enquiry is created
   */
  async sendNewEnquiryAlert(enquiry: any) {
    try {
      await prisma.notification.create({
        data: {
          title: "New Enquiry Received",
          message: `${enquiry.name} sent a new message: ${enquiry.subject}`,
          type: "NEW_ENQUIRY",
        }
      });
    } catch (error) {
      console.error("NotificationService.sendNewEnquiryAlert failed silently:", error);
    }
  }
}

export const notificationService = new NotificationService();
