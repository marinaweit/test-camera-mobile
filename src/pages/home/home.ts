import { Component } from "@angular/core";
import { CameraOptions } from "@ionic-native/camera/ngx";
import { ActionSheetController } from "ionic-angular";

declare let navigator;
declare let window;

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  constructor(public actionSheetController: ActionSheetController) {}

  ionViewWillEnter() {
    const imagePath: string = localStorage.getItem("imagePath");
    imagePath
      ? document.getElementById("userImage").setAttribute("src", imagePath)
      : "";
  }

  public async setPhoto() {
    const actionSheet = await this.actionSheetController.create({
      buttons: [
        {
          text: "CHOOSE FROM PHOTOLIBRARY",
          icon: "images",
          handler: () => {
            this.takePhoto(navigator.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: "TAKE PHOTO",
          icon: "camera",
          handler: () => {
            this.takePhoto(navigator.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: "CANCEL",
          role: "cancel",
          icon: "close",
          handler: () => {
            console.log("Cancel clicked");
          }
        }
      ]
    });
    await actionSheet.present();
  }

  public takePhoto(PictureSourceType: number): void {
    let opts: CameraOptions = {
      quality: 50,
      sourceType: PictureSourceType,
      destinationType: navigator.camera.DestinationType.FILE_URI,
      mediaType: navigator.camera.MediaType.PICTURE,
      encodingType: navigator.camera.EncodingType.JPEG,
      cameraDirection: navigator.camera.Direction.BACK,
      targetWidth: 300,
      targetHeight: 300
    };

    navigator.camera.getPicture(onSuccess, onFail, opts);

    function onSuccess(imageData: string): void {
      let imagePath: string = window.Ionic.WebView.convertFileSrc(imageData);
      document.getElementById("userImage").setAttribute("src", imagePath);
      localStorage.setItem("imagePath", imagePath);
    }

    function onFail(message: string): void {
      console.error("Failed to load image because: " + message);
    }
  }
}
