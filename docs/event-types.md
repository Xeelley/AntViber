### List of all availble types for Ant.add

```ts
Ant.add(type: 'message', status: string, listener: (userProfile: string, text: string) => any): void;

Ant.add(type: 'sticker', status: string, listener: (user: string, stickerId: number) => any): void;

Ant.add(type: 'picture', status: string, listener: (user: string, picture: ViberPicture) => any): void;

Ant.add(type: 'file', status: string, listener: (user: string, file: ViberFile) => any): void;

Ant.add(type: 'location', status: string, listener: (user: string, location: ViberLocation) => any): void;

Ant.add(type: 'contact', status: string, listener: (user: string, contact: ViberContact) => any): void;

Ant.add(type: 'message_sent', status: string, listener: (userProfile: string, text: string) => any): void;

Ant.add(type: 'rich_payload', status: string, listener: (userProfile: string, data: string) => any): void;

Ant.add(type: 'subscribed', status: string, listener: (userProfile: string) => any): void;

Ant.add(type: 'unsubscribed', status: string, listener: (userProfile: string) => any): void;
```