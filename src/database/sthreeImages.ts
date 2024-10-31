import { getImage } from "./sthree";

// This code is to handle the distribution of pictures to the messaging page
// This page contains an array of conversations
// A conversations contains an array of Messages an array of Users and an array of Organizations
// Each of these contains a picture
// This program changes the file keys to urls
// This program uses regex to not suck in urls.

const sthreeInterface = {
  process: function (data: any[]) {},
  swap: function (data: any) {},
};
type url = {
  key: string;
  url: string;
  id: string;
  date: Date;
};

type bigArray = {
  conversations: any;
  messages: any[];
  organizations: any[];
  users: any[];
}[];

export class sthreeImages {
  urlList: url[];
  allData: any[];
  // Do not know what type a regex is
  httpRegex: any;

  constructor() {
    this.urlList = new Array(0);
    this.allData = new Array(0);

    // I think this is the right regex expression
    this.httpRegex = /http/i;
  }

  // Checks the urls in the database response and changes them where needed
  // Using type:any because I am mainly accessing JSON data.

  async process(data: any) {
    // Finds images for the organization array and swaps images in the organization array
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].organizations.length; j++) {
        // If string does not contain "http" it is assumed to be a url and is skipped
        // Need to debug this code
        //data[i].organizations[j].thumbnail.storageId.match(this.httpRegex)
        //.length == 0
        if (false) {
          let address: string = await getImage(
            data[i].organizations[j].thumbnail.storageId
          );
          let newUrl: url = {
            key: data[i].organizations[j].thumbnail.storageId,
            url: address,
            id: data[i].organizations[j].id,
            date: new Date(),
          };
          this.urlList.push(newUrl);
          data[i].organizations[j].thumbnail.storageId = address;
        }
      }
      // Finds images for the user array and swaps images in the user array
      for (let j = 0; j < data[i].users.length; j++) {
        if (data[i].users[j].customImage) {
          // If string does not contain "http" it is assumed to be a url and is skipped
          //data[i].users[j].customeUserImage.match(this.httpRegex).length == 0
          if (false) {
            let address: string = await getImage(
              data[i].users[j].customeUserImage
            );
            let newUrl: url = {
              key: data[i].users[j].customeUserImage,
              url: address,
              id: data[i].users[j].id,
              date: new Date(),
            };
            this.urlList.push(newUrl);
            data[i].users[j].image = address;
          }
        }
      }
      console.log("Next");
      // Swaps images in the messages array
      // we do not do a regex check because if the value is not in the urlList it does not need to be changed.
      for (let j = 0; j < data[i].messages.length; j++) {
        console.log("message");
        if (data[i].messages[j].sender_organization_id == null) {
          for (let k = 0; k < this.urlList.length; k++) {
            if (this.urlList[k].id == data[i].messages[j].sender_user_id) {
              data[i].messages[j].userImage = this.urlList[k].url;
            }
          }
        } else {
          for (let k = 0; k < this.urlList.length; k++) {
            if (
              this.urlList[k].id == data[i].messages[j].sender_organization_id
            ) {
              data[i].messages[j].userImage = this.urlList[k].url;
            }
          }
        }
      }
    }
    // Keep a reference to the big array to use for later
    this.allData = data;

    return data;
  }
  // swaps a single image, this is used when a new message appears
  // Using type:any because I am mainly accessing JSON data.
  async swap(data: any) {
    for (let i = 0; i < this.urlList.length; i++) {
      if (data.senderID != null) {
        if (data.senderId == this.urlList[i]) {
          let expire = new Date(
            this.urlList[i].date.setHours(this.urlList[i].date.getHours() + 1)
          );
          let currentTime = new Date();
          if (expire < currentTime) {
            //this.urlList[i].url = await getImage(this.urlList[i].key);
            this.urlList[i].date = currentTime;
          }
          return this.urlList[i].url;
        }
      } else {
        if (data.senderOrganizationId == this.urlList[i]) {
          let expire = new Date(
            this.urlList[i].date.setHours(this.urlList[i].date.getHours() + 1)
          );
          let currentTime = new Date();
          if (expire < currentTime) {
            //this.urlList[i].url = await getImage(this.urlList[i].key);
            this.urlList[i].date = currentTime;
          }
          return this.urlList[i].url;
        }
      }
    }
    for (let i = 0; i < this.allData.length; i++) {
      if (this.allData[i].conversations.id == data.conversationId) {
        if (data.SenderID != null) {
          for (let j = 0; j < this.allData[i].users.length; j++) {
            if (this.allData[i].users[j].id == data.senderId) {
              return this.allData[i].users[j].image;
            }
          }
        } else {
          for (let j = 0; j < this.allData[i].users.length; j++) {
            if (
              this.allData[i].organizations[j].id == data.senderOrganizationId
            ) {
              return this.allData[i].organizations[j].thumbnail.storageId;
            }
          }
        }
      }
    }
  }
}
