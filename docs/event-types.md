### List of all availble types for Ant.add

```ts
Ant.add(type: 'message', status: string, listener: (userProfile: string, text: string) => any): void;

Ant.add(type: 'message_sent', status: string, listener: (userProfile: string, text: string) => any): void;

Ant.add(type: 'rich_payload', status: string, listener: (userProfile: string, data: string) => any): void;

Ant.add(type: 'subscribed', status: string, listener: (userProfile: string) => any): void;

Ant.add(type: 'unsubscribed', status: string, listener: (userProfile: string) => any): void;
```