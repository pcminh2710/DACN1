$(document).ready(function() {
    // $('#searchName').focusout(function() {
    //     $('#text').html('');
    //     $('#list-suggesstion').html('');
    //     $(this).val("")
    //     document.getElementById('list-conversation').style.display = 'block';
    // });
    $.ajax({
        type: "POST",
        url: "./nhan-dien-khuon-mat/recognitiondata.py",
        success: function(){

        }
      });

    $('.container-right').click(function() {
        $('#text').html('');
        $('#list-suggesstion').html('');
        $('#searchName').val("")
        document.getElementById('list-conversation').style.display = 'block'
        document.getElementById('user__setting-container').style.display = 'none'
    })

    var check = true;
    $('.user-setting').click(function() {
        if (check) {
            document.getElementById('user__setting-container').style.display = 'block'
            check = false;
        } else {
            document.getElementById('user__setting-container').style.display = 'none'
            check = true
        }

    })
    $('.user__setting--face').click(function() {
        document.getElementById('container-model-face').style.display = 'block'
    })
    $('#recognition').click(function() {
        document.getElementById('container-model-recognition').style.display = 'block'
    })
    $('.face__close').click(function() {
        document.getElementById('container-model-recognition').style.display = 'none'
        document.getElementById('container-model-face').style.display = 'none'
    })

    $('#check__confim').change(function() {
        if ($(this).prop('checked')) {
            $('.btn_face--hidden').hide()
        } else {
            $('.btn_face--hidden').show()
        }
    });

    $('#check__confim-recog').change(function() {
        if ($(this).prop('checked')) {
            $('.btn_recognition--hidden').hide()
        } else {
            $('.btn_recognition--hidden').show()
        }
    });

    $('.btn__face').click(function() {
        toast({
            title: "Th??ng b??o",
            message: "??ang b???t camera...",
            type: "success",
            duration: 5000
        });
        $.ajax({
            type: "POST",
            url: "name",
            success: function(result) {
                if(result == "ok"){
                    toast({
                        title: "Th??ng b??o",
                        message: "B???n ???? ????ng k?? khu??n m???t th??nh c??ng",
                        type: "success",
                        duration: 5000
                    });
                }
            }
        });
        document.getElementById('container-model-face').style.display = 'none'
        console.log("button")
    })
    
    $('.btn_recognition').click(function() {
        console.log("recognition")
        toast({
            title: "Th??ng b??o",
            message: "??ang b???t h??? th???ng nh???n di???n khu??n m???t...",
            type: "success",
            duration: 5000
        });
        $.ajax({
            type: "POST",
            url: "recognition",
            success: function(result) {
                setTimeout(function(){
                    if(result == "nofile"){
                        toast({
                            title: "Th??ng b??o",
                            message: "B???n ch??a ????ng k?? khu??ng m???t",
                            type: "success",
                            duration: 5000
                        });
                    }
                },2000)
            }
        });
        document.getElementById('container-model-recognition').style.display = 'none'

    })
    $('#searchName').focusin(function() {
        document.getElementById('suggesstion-box').style.display = 'block';
        document.getElementById('list-conversation').style.display = 'none';
        document.getElementById('list-conversation').style.display = 'none';
        $('#text').html('');
        $('#list-suggesstion').html('');
    });
    $('#list-suggesstion').focusin(function() {
        document.getElementById('suggesstion-box').style.display = 'block';
    });



    function toast({ title = "", message = "", type = "info", duration = 3000 }) {
        const main = document.getElementById("notification__all");
        if (main) {
          const toast = document.createElement("div");
      
          // Auto remove toast
          const autoRemoveId = setTimeout(function () {
            main.removeChild(toast);
          }, duration);
      
          // Remove toast when clicked
          toast.onclick = function (e) {
            if (e.target.closest(".toast__close")) {
              main.removeChild(toast);
              clearTimeout(autoRemoveId);
            }
          };
      
    
          const delay = (duration / 1000).toFixed(2);
      
          toast.classList.add("notification__all");
      
          toast.innerHTML = `
                          <div class="toast__icon">
                              <i class="fas fa-bell"></i>
                          </div>
                          <div class="toast__body">
                              <h3 class="toast__title">${title}</h3>
                              <p class="toast__msg">${message}</p>
                          </div>
                      `;
          main.appendChild(toast);
        }
    }
      
});

const checkFriend = (idSender, idReceiver) => {
    $.ajax({
        url: "/checkFriend",
        type: "POST",
        data: {
            idSender: idSender,
            idReceiver: idReceiver
        },
        success: (result) => {
            $.each(result, function(key, val) {
                if (val.status == "1") {
                    document.getElementById('friend' + idReceiver).style.display = 'block'
                    $('.friend' + idReceiver).html('<i class="fas fa-check"></i><span> B???n b??</span>')
                } else if (val.status == "0") {
                    if (val.idSender == idSender) {
                        document.getElementById('cancel' + idReceiver).style.display = 'block'
                        $('.cancel' + idReceiver).html('<i class="fas fa-user-times"></i><span> ???? g???i l???i m???i</span>')
                    } else if (val.idReceiver == idSender) {
                        document.getElementById('contentConfim' + idReceiver).style.display = 'block'
                        $('.confim' + idReceiver).html('X??c Nh???n')
                        $('.huy' + idReceiver).html('H???y')
                    }
                }
            })
        }
    })
}

const buttonFriend = (id) => {
    var idUser = idUser1;
    $.ajax({
        url: "/friend",
        type: "POST",
        data: {
            userId: idUser
        },
        success: function(result) {
            $.each(result, function(key, val) {
                var friends = val.friend.split(',')
                if (friends.includes(id + "")) {
                    checkFriend(idUser, id)
                } else {
                    if (id != idUser) {
                        document.getElementById('add' + id).style.display = 'block'
                        $('.add' + id).html('<i class="fas fa-user-plus"></i><span> Th??m b???n b??</span>')
                    }
                }
            })
        }
    });
}

//h??m th??m b???n b??
const addFriend = (name, idReceiver) => {
    var idUser = idUser1;
    $.ajax({
        url: "/addFriend",
        type: "POST",
        data: {
            idUser: idUser,
            idReceiver: idReceiver
        },
        success: function(result) {
            if (result) {
                alert("B???n ???? g???i l???i m???i k???t b???n t???i " + name + "")
                document.getElementById('add' + idReceiver).style.display = 'none'
                document.getElementById('cancel' + idReceiver).style.display = 'block'
                $('.cancel' + idReceiver).html('<i class="fas fa-user-times"></i><span> ???? g???i l???i m???i</span>')
            }
        }
    })

}

//h??m h???y l???i m???i k???t b???n
const cancelInvitation = (name, idReceiver) => {
    var confim = confirm("B???n c?? mu???n h???y l???i m???i k???t b???n " + name + " kh??ng?");
    if (confim == true) {
        var idUser = idUser1
        $.ajax({
            url: "/cancelInvitation",
            type: "POST",
            data: {
                idUser: idUser,
                idReceiver: idReceiver
            },
            success: function(result) {
                if (result) {
                    document.getElementById('cancel' + idReceiver).style.display = 'none'
                    document.getElementById('add' + idReceiver).style.display = 'block'
                    $('.add' + idReceiver).html('<i class="fas fa-user-plus"></i><span> Th??m b???n b??</span>')
                }
            }
        })

    }

}

//h???y b???n b??
const cancelFriend = (name, idReceiver) => {
    var idUser = idUser1;
    var confim = confirm("B???n c?? mu???n h???y k???t b???n v???i " + name + " kh??ng?");
    if (confim) {
        $.ajax({
            url: "/cancelInvitation",
            type: "POST",
            data: {
                idUser: idUser,
                idReceiver: idReceiver
            },
            success: function(result) {
                if (result) {
                    document.getElementById('friend' + idReceiver).style.display = 'none'
                    document.getElementById('add' + idReceiver).style.display = 'block'
                    $('.add' + idReceiver).html('<i class="fas fa-user-plus"></i><span> Th??m B???n b??</span>')
                }
            }
        })
    }
}

//t??? ch???i l???i m???i
const deleteInvitation = (name, idReceiver) => {
    var confim = confirm("B???n c?? mu???n t??? ch???i l???i m???i k???t b???n c???a " + name + " kh??ng?");
    if (confim == true) {
        var idUser = idUser1
        $.ajax({
            url: "/cancelInvitation",
            type: "POST",
            data: {
                idUser: idUser,
                idReceiver: idReceiver
            },
            success: function(result) {
                if (result) {
                    document.getElementById('contentConfim' + idReceiver).style.display = 'none'
                    document.getElementById('add' + idReceiver).style.display = 'block'
                    $('.add' + idReceiver).html('<i class="fas fa-user-plus"></i><span> Th??m b???n b??</span>')
                }
            }
        })

    }
}

//x??c nh???n l???i m???i k???t b???n
const confimInvitation = (name, idReceiver) => {
    var idUser = idUser1;
    $.ajax({
        url: "/confimInvitation",
        type: "POST",
        data: {
            idUser: idUser,
            idReceiver: idReceiver
        },
        success: function(result) {
            if (result) {
                document.getElementById('contentConfim' + idReceiver).style.display = 'none'
                document.getElementById('friend' + idReceiver).style.display = 'block'
                $('.friend' + idReceiver).html('<i class="fas fa-check"></i><span> B???n b??</span>')
                alert("B???n ???? ch???p nh???n l???i k???t b???n c???a " + name + "")
            }
        }
    })

}

//l???y id ng?????i d??ng khi click v??o k???t qu??? t??m ki???m
const Receiver = (id) => {
    $.ajax({
        url: "/receiver",
        type: "POST",
        data: {
            userId: id
        },
        success: function(result) {
            // $.each(result, function(key, val) {
            //     $('.nameReceiver').html(val.name);
            //     document.getElementById('suggesstion-box').style.display = 'none';
            //     $("#searchName").val("")
            //     window.history.pushState('page2', 'Title');
            // })
        }
    });
}

//c???p nh???t ???nh ?????i di???n

//l???y t??n file ???nh
var replaceTest = function(str) {
    return str.replace(/^.*(\\|\/|\:)/, '');
}

function updateImage(idUser) {
    var image = $('.file-anh').val()
    var naemImage = replaceTest(image)
    console.log(idUser + naemImage)
}


//hi???n th??? search
$(function() {
    $("#searchName").autocomplete({
        source: function(request, response) {
            $.ajax({
                url: "/search",
                type: "GET",
                dataType: 'json',
                data: request, // request is the value of search input
                success: function(data) {
                    var text = document.getElementById('searchName').value;

                    $('#list-suggesstion').html('');

                    if (data.length != 0) {
                        $('#text').html(`<div class="content-search"><span class="icon-search">
                        <i class="fas fa-search"></i></span> &nbsp t??m ki???m tin nh???n cho "` + text + `"</div>
                        <div class="title-search" style="padding: 10px 15px 10px 15px;">Ngu???i d??ng</div>`);
                        $.each(data, function(key, value) {
                            $('#list-suggesstion').append(`
                            <div  id="row-search" class="row-search">
                            <div onclick=Receiver("` + value.id + `")>
                            <img src="assets/image/` + value.image + `" height= "30px" width="30px" class="image-user-search" />
                            ` + value.name + `</div>
                            <div class="addFriend">
                            <button id="add` + value.id + `" onclick=addFriend("` + value.name + `",'` + value.id + `') class="friend add` + value.id + `">` + buttonFriend(value.id) + `</button>
                            <button id="cancel` + value.id + `" onclick=cancelInvitation("` + value.name + `",'` + value.id + `') class="friend cancel` + value.id + `">` + buttonFriend(value.id) + `</button>
                            <button id="friend` + value.id + `" onclick=cancelFriend("` + value.name + `",'` + value.id + `') class="friend friend` + value.id + `">` + buttonFriend(value.id) + `</button>
                            <div id="contentConfim` + value.id + `" class="confim">
                            <button id="confim` + value.id + `" onclick=confimInvitation("` + value.name + `",'` + value.id + `') class="confim` + value.id + `">` + buttonFriend(value.id) + `</button>
                            <button id="huy` + value.id + `" onclick=deleteInvitation("` + value.name + `",'` + value.id + `') class="huy` + value.id + `"></button>
                            </div>
                            </div>
                            </div>`);
                        });
                    } else {
                        $('#text').html(`<div class="content-search"><span class="icon-search">
                        <i class="fas fa-search"></i></span> &nbsp t??m ki???m tin nh???n cho "` + text + `"</div>`);
                        $('#list-suggesstion').html(`<div style="text-align: center;padding-top:20px">
                        <div style="font-size: 18px;color: #F1FFFF">Kh??ng t??m th???y k???t qu???</div>
                        <div style="padding: 5px 10px 0px 10px">ch??ng t??i kh??ng t??m ???????c k???t qu??? n??o cho "` + text + `".H??y th??? ki???m tra ch??nh t??? ho???c d??ng t??? ho??n ch???nh </div></div>`)
                    }
                },
                error: function(err) {
                    console.log(err);
                }
            });
        },

        // The minimum number of characters a user must type before a search is performed.
        minLength: 1,
        select: function(event, ui) {
            if (ui.item) {
                $('#searchName').text(ui.item.label);
            }
        }
    });

});