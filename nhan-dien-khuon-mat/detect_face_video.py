import cv2
import os
import trainingdata
import sys

args = sys.argv
def detect():
    # Load the cascade
    face_cascade = cv2.CascadeClassifier('../DACN1/nhan-dien-khuon-mat/haarcascade_frontalface_default.xml')

    # To capture video from webcam. 
    cap = cv2.VideoCapture(0)

    sampleNum = 0
    while True:
        # Read the frame
        _, img = cap.read()

        # Convert to grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        scale_percent = 70

        width = int(img.shape[1] * scale_percent / 100)
        height = int(img.shape[0] * scale_percent / 100)


        # Detect the faces
        faces = face_cascade.detectMultiScale(gray, 1.1, 4)
         
        if len(faces) == 0:
            cv2.putText(img, "Vui long de mat cua ban truoc camera" , (1,40), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0) ,2)
            

        # Draw the rectangle around each face
        for (x, y, w, h) in faces:
            cv2.rectangle(img, (x, y), (x+w, y+h), (255, 0, 0), 2)
            
            
            if not os.path.exists('dataSet'):
                os.makedirs('dataSet')

            sampleNum += 1
            cv2.putText(img, "face: " +str(sampleNum) , (1,40), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0) ,2)

            cv2.imwrite('dataSet/User.'+str(1)+'.'+ str(sampleNum)+ '.jpg', gray[y:y+h,x:x+w])  

        # Display
        cv2.imshow('img', img)

        if sampleNum > 200:
            trainingdata.train()
            break

        # Stop if escape key is pressed
        k = cv2.waitKey(30) & 0xff
        if k==27:
            break

    
        
    # Release the VideoCapture object
    cap.release()
    cv2.destroyAllWindows()


detect()



