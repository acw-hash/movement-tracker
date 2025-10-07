import { loadStripe } from '@stripe/stripe-js';

export const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
);

export const STRIPE_PRICES = {
  pro_monthly: 'price_pro_monthly',
  pro_yearly: 'price_pro_yearly',
  elite_monthly: 'price_elite_monthly',
  elite_yearly: 'price_elite_yearly',
};
