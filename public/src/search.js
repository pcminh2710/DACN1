$(document).ready(function() {
    // $("input").focusout(function() {
    //     $('#text').html('');
    //     $('#list-suggesstion').html('');
    //     $(this).val("")
    // });
    $("input").focusin(function() {
        document.getElementById('suggesstion-box').style.display = 'block';
        $('#text').html('');
        $('#list-suggesstion').html('');
    });
    $('#list-suggesstion').focusin(function() {
        document.getElementById('suggesstion-box').style.display = 'block';
    });
    var name1 = name;
    $('.nameReceiver').html(name1);

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
                    $('.friend' + idReceiver).html('<i class="fas fa-check"></i><span> Bạn bè</span>')
                } else if (val.status == "0") {
                    if (val.idSender == idSender) {
                        document.getElementById('cancel' + idReceiver).style.display = 'block'
                        $('.cancel' + idReceiver).html('<i class="fas fa-user-times"></i><span> Đã gửi lời mời</span>')
                    } else if (val.idReceiver == idSender) {
                        document.getElementById('contentConfim' + idReceiver).style.display = 'block'
                        $('.confim' + idReceiver).html('Xác Nhận')
                        $('.huy' + idReceiver).html('Hủy')
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
                        $('.add' + id).html('<i class="fas fa-user-plus"></i><span> Thêm bạn bè</span>')
                    }
                }
            })
        }
    });
}

//hàm thêm bạn bè
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
                alert("Bạn đã gửi lời mời kết bạn tới " + name + "")
                document.getElementById('add' + idReceiver).style.display = 'none'
                document.getElementById('cancel' + idReceiver).style.display = 'block'
                $('.cancel' + idReceiver).html('<i class="fas fa-user-times"></i><span> Đã gửi lời mời</span>')
            }
        }
    })

}

//hàm hủy lời mời kết bạn
const cancelInvitation = (name, idReceiver) => {
    var confim = confirm("Bạn có muốn hủy lời mời kết bạn " + name + " không?");
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
                    $('.add' + idReceiver).html('<i class="fas fa-user-plus"></i><span> Thêm bạn bè</span>')
                }
            }
        })

    }

}

//hủy bạn bè
const cancelFriend = (name, idReceiver) => {
    var idUser = idUser1;
    var confim = confirm("Bạn có muốn hủy kết bạn với " + name + " không?");
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
                    $('.add' + idReceiver).html('<i class="fas fa-user-plus"></i><span> Thêm Bạn bè</span>')
                }
            }
        })
    }
}

//từ chối lời mời
const deleteInvitation = (name, idReceiver) => {
    var confim = confirm("Bạn có muốn từ chối lời mời kết bạn của " + name + " không?");
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
                    $('.add' + idReceiver).html('<i class="fas fa-user-plus"></i><span> Thêm bạn bè</span>')
                }
            }
        })

    }
}

//xác nhận lời mời kết bạn
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
                $('.friend' + idReceiver).html('<i class="fas fa-check"></i><span> Bạn bè</span>')
                alert("Bạn đã chấp nhận lời kết bạn của " + name + "")
            }
        }
    })

}

//lấy id người dùng khi click vào kết quả tìm kiếm
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

//cập nhật ảnh đại diẹn

//lấy tên file ảnh
var replaceTest = function(str) {
    return str.replace(/^.*(\\|\/|\:)/, '');
}

function updateImage(idUser) {
    var image = $('.file-anh').val()
    var naemImage = replaceTest(image)
    console.log(idUser + naemImage)
}



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
                        <i class="fas fa-search"></i></span> &nbsp tìm kiếm tin nhắn cho "` + text + `"</div>
                        <div class="title-search" style="padding: 10px 15px 10px 15px;">Nguời dùng</div>`);
                        $.each(data, function(key, value) {
                            $('#list-suggesstion').append(`<div  id="row-search" class="row-search">
                            <div onclick=Receiver("` + value.id + `")>
                            <img src="assets/image/user.jpg" height= "30px" width="30px" class="image-user-search" />
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
                        <i class="fas fa-search"></i></span> &nbsp tìm kiếm tin nhắn cho "` + text + `"</div>`);
                        $('#list-suggesstion').html(`<div style="text-align: center;padding-top:20px">
                        <div style="font-size: 18px;color: #F1FFFF">Không tìm thấy kết quả</div>
                        <div style="padding: 5px 10px 0px 10px">chúng tôi không tìm được kết quả nào cho "` + text + `".Hãy thử kiểm tra chính tả hoặc dùng từ hoàn chỉnh </div></div>`)
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