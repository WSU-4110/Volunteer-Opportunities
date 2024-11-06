"use client";
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

  constructor() {
    this.urlList = new Array(0);
    this.allData = new Array(0);
  }

  // Checks the urls in the database response and changes them where needed
  // Using type:any because I am mainly accessing JSON data.

  async process(data: any) {
    //console.log("dump");
    //console.log(data);
    // Finds images for the organization array and swaps images in the organization array
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].organizations.length; j++) {
        {
          let key = JSON.parse(data[i].organizations[j].thumbnail);
          //let address: string = await getImage(key.storageId) added to test without s3 images currently images are urls change latter;
          //console.log(key);
          let newUrl: url = {
            key: key.storageId,
            //url: address,
            url: key.storageId,
            id: data[i].organizations[j].id,
            date: new Date(),
          };
          this.urlList.push(newUrl);
          //data[i].organizations[j].thumbnail.storageId =JSON.stringify({storageId: address,});
          data[i].organizations[j].thumbnail = JSON.stringify({
            storageId: key.storageId,
          });
        }
      }
      // Finds images for the user array and swaps images in the user array
      for (let j = 0; j < data[i].users.length; j++) {
        if (data[i].users[j].customImage) {
          //console.log(data[i].users[j].customUserImage);
          let jsonKey = JSON.parse(data[i].users[j].customUserImage);
          //console.log(jsonKey.id);
          let address: string = data[i].users[j].image;
          //let address: string = await getImage(jsonKey.id);
          let newUrl: url = {
            key: jsonKey.id,
            url: address,
            id: data[i].users[j].id,
            date: new Date(),
          };
          this.urlList.push(newUrl);
          data[i].users[j].image = address;
        }
      }
      //console.log("Next");
      // Swaps images in the messages array
      // we do not do a regex check because if the value is not in the urlList it does not need to be changed.
      for (let j = 0; j < data[i].messages.length; j++) {
        //console.log("message");
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
    console.log(this.urlList);
    return data;
  }
  // swaps a single image, this is used when a new message appears
  // Using type:any because I am mainly accessing JSON data.
  async swap(data: any) {
    console.log(data);
    console.log(this.urlList);
    console.log(data.senderId);
    for (let i = 0; i < this.urlList.length; i++) {
      console.log("searching");
      if (data.senderId != null) {
        console.log("searching 2");
        if (data.senderId == this.urlList[i].id) {
          let expire = new Date(
            this.urlList[i].date.setHours(this.urlList[i].date.getHours() + 1)
          );
          let currentTime = new Date();
          if (expire < currentTime) {
            //this.urlList[i].url = await getImage(this.urlList[i].key);
            this.urlList[i].date = currentTime;
          }
          console.log(this.urlList[i].url);
          return this.urlList[i].url;
        }
      } else {
        if (data.senderOrganizationId == this.urlList[i].id) {
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
          for (let j = 0; j < this.allData[i].organizations.length; j++) {
            if (
              this.allData[i].organizations[j].id == data.senderOrganizationId
            ) {
              const org = JSON.parse(
                this.allData[i].organizations[j].thumbnail
              );
              return org.storageId;
            }
          }
        }
      }
    }
  }
}
