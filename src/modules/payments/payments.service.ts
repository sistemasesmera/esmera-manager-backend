import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-09-30.clover',
  });

  async createCheckoutSession({
    priceId,
    metadata,
  }: {
    priceId: string;
    metadata: Record<string, string>;
  }) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'payment',
      success_url: 'http://esmeraschool.com/cursos/pago-exitoso',
      cancel_url: 'http://esmeraschool.com/cursos/pago-cancelado',
      metadata, // aquí pasamos nombre, apellido, teléfono, curso, etc.
    });

    return session.url;
  }

  constructEvent(rawBody: Buffer, signature: string, webhookSecret: string) {
    return this.stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret,
    );
  }

  async listLineItems(sessionId: string) {
    return this.stripe.checkout.sessions.listLineItems(sessionId, { limit: 1 });
  }
}
