# from tkinter import *
# from tkinter import scrolledtext
# from PIL import Image, ImageTk
# import tkinter
# import cv2
# import PIL.Image, PIL.ImageTk
# import detect_face_video
# import recognitiondata


# def main(): 

#     master_window = Tk()
#     master_window.title("form")

#     master_window.geometry("500x500")

#     button = Button(master_window, text = "Đăng ký khuông mặt", command =  detect_face_video.detect)
#     button.pack(side = LEFT)  

#     button = Button(master_window, text = "Nhận diện khuông mặt", command = recognitiondata.recognition)
#     button.pack(side = RIGHT)  
#     mainloop()


# main()



import sys, json, numpy as np

#Read data from stdin
def read_in():
    lines = sys.stdin.readlines()
    #Since our input would only be having one line, parse our JSON data from that
    return json.loads(lines[0])

def main():
    #get our data as an array from read_in()
    lines = read_in()

    #create a numpy array
    np_lines = np.array(lines)

    #use numpys sum method to find sum of all elements in the array
    lines_sum = np.sum(np_lines)

    #return the sum to the output stream
    print lines_sum

#start process
if __name__ == '__main__':
    main()