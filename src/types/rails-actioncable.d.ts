declare module '@rails/actioncable' {
  export interface Cable {
    subscriptions: Subscriptions
    connect(): void
    disconnect(): void
  }

  export interface Subscriptions {
    create(
      channel: string | { channel: string;[key: string]: any },
      callbacks?: {
        connected?(): void
        disconnected?(): void
        received?(data: any): void
        rejected?(): void
      }
    ): Subscription
    remove(subscription: Subscription): void
  }

  export interface Subscription {
    unsubscribe(): void
    send(data: any): void
    perform(action: string, data?: any): void
  }

  export function createConsumer(url?: string): Cable

  export default {
    createConsumer,
  }
}
