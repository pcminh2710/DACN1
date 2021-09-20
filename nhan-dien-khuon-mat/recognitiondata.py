import cv2
import numpy as np
from PIL import Image
import pickle
import requests
import time


# def recognition():
faceDetect=cv2.CascadeClassifier('../DACN1/nhan-dien-khuon-mat/haarcascade_frontalface_default.xml')
cam=cv2.VideoCapture(0)
rec=cv2.face.LBPHFaceRecognizer_create()
rec.read("recognizer/trainningData.yml")

id=0
#set text style
fontface = cv2.FONT_HERSHEY_SIMPLEX
fontscale = 1
fontcolor = (203,23,252)

dem =0
while(True):
    #camera read
    ret,img=cam.read()
    gray=cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)
    faces=faceDetect.detectMultiScale(gray)

    if len(faces) == 0:
        dem +=1
        if (dem == 150):
            
            url = 'http://localhost:8000/auth'

            correct_payload = {'type': 'noface'}

            # Output => OK
            r = requests.post(url, json=correct_payload)
            dem = 0
            # print(r.text)

    for(x,y,w,h) in faces:
        cv2.rectangle(img,(x,y),(x+w,y+h),(255,0,0),2)
        id,conf=rec.predict(gray[y:y+h,x:x+w])
        # profile=getProfile(id)
        #set text to window
        if(conf < 40):
            dem = 0
            #cv2.PutText(cv2.fromarray(img),str(id),(x+y+h),font,(0,0,255),2);
            cv2.putText(img, "Ban day roi !!!", (x,y+h+30), fontface, fontscale, fontcolor ,2)
           
        else:
            dem += 1
            cv2.putText(img, "unknow" , (x,y+h+90), fontface, fontscale, fontcolor ,2)

            if(dem == 150):
                url = 'http://localhost:8000/auth'

                correct_payload = {'type': 'failface'}

                # Output => OK
                r = requests.post(url, json=correct_payload)
                dem = 0
                # print(r.text)

    cv2.imshow('Face',img) 
    if cv2.waitKey(1)==ord('q'):
        break
cam.release()
cv2.destroyAllWindows()

# recognition()