window.addEventListener('load', function() {
    var vm = new Vue({
        el: ".comment",
        data: {
            writer: {
                id: '',
                floor: '',
                qq: '',
                username: '',
                avatar: '',
                writeTime: '',
                message: ''
            },
            messages: [],
            fileList: [],
            uploadCount: 1,
            dialogImageUrl: '',
            dialogVisible: false,
            disabled: false,
            currentPage: 1,
            pageSize: 10,
            totalCount: 0
        },
        methods: {
            openPromptMessage(msg, type) {
                if (type == 'success') {
                    this.$message({
                        message: msg,
                        type: 'success'
                    });
                } else if (type == 'warning') {
                    this.$message({
                        message: msg,
                        type: 'warning'
                    });
                } else if (type == 'error') {
                    this.$message.error(msg);
                } else {
                    this.$message(msg);
                }
            },

            handleChange(file, fileList) {
                this.fileList = fileList
            },

            handleUploadSuccess(resp, file, fileList) {
                if (this.uploadCount <= fileList.length) {
                    this.writer.message += (this.writer.message == '' ? '' : '<br>') + '<img src="\\upload\\' + resp + '">';
                } 

                if (fileList.length == this.uploadCount) {
                    let jsonData = JSON.stringify(this.writer);
                    let _this = this;
                    ajax.post({
                        url: "http://39.108.62.108/msg/",
                        data: jsonData,
                        onSuccess: function(result) {
                            if (result == 'true') {
                                _this.writer = {
                                    id: '',
                                    floor: '',
                                    qq: '',
                                    username: '',
                                    avatar: '',
                                    writeTime: '',
                                    message: ''
                                }
                                _this.uploadCount = 1;
                                _this.$refs.upload.clearFiles();
                                _this.selectAll();
                            }
                        }
                    });
                }
                this.uploadCount += 1;
            },

            handleRemove(file, fileList) {
                this.fileList = fileList;
            },

            handleExceed(fileList) {
                this.$message.warning(`?????????????????? 3 ?????????????????????????????? ${fileList.length} ?????????`);
            },

            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },

            // ?????????????????????
            handleSizeChange(val) {
                this.pageSize = val;
                this.selectAll();
            },

            handleCurrentChange(val) {
                this.currentPage = val;
                this.selectAll();
            },

            submitUploadPic() {
                this.$refs.upload.submit();
            },

            selectAll() {
                let _this = this;
                ajax.get({
                    url: "http://39.108.62.108/msg/page?page=" + _this.currentPage + "&pageSize=" + _this.pageSize,
                    onSuccess: function(result) {
                        let data = JSON.parse(result);
                        _this.messages = data.data.records;
                        _this.totalCount = data.data.total;
                        _this.$message.success(data.msg, 'success');
                    }
                });
            }
        },
        mounted() {
            this.selectAll();
        }
    });

    const section = this.document.querySelector('.section');
    const messageArea = section.querySelector('.messageArea');
    const textArea = section.querySelector('.textArea');

    // ????????????
    var isLogin = false;
    const aside = section.querySelector('.aside');
    const loginUser = aside.querySelector('.user');
    const login = aside.querySelector('.login');

    const imgUser = loginUser.querySelector('img');
    const nameUser = loginUser.querySelector('p');

    const inputUn = login.querySelector('#login_un');
    const inputPwd = login.querySelector('#login_pwd');

    inputUn.addEventListener('blur', function() {
        let warn = this.nextElementSibling.children[0];
        if (this.value == '')
            warn.innerHTML = '?????????????????????';
        else 
            warn.innerHTML = '';
    });

    inputPwd.addEventListener('blur', function() {
        let warn = this.nextElementSibling.children[0];
        if (this.value == '')
            warn.innerHTML = '??????????????????';
        else 
            warn.innerHTML = '';
    });

    const submitLogin = login.querySelector('.submitLogin');
    const registerBtn = login.querySelector('.registerBtn');

    // ?????????????????????
    const remember = login.querySelector('.remember');
    const rememberCheck = remember.querySelector('input');
    if (this.localStorage.getItem('lyb_un')) {
        inputUn.value = this.localStorage.getItem('lyb_un');
        rememberCheck.checked = true;
    }

    if (this.localStorage.getItem('lyb_pwd')) {
        inputPwd.value = this.localStorage.getItem('lyb_pwd');
        rememberCheck.checked = true;
    }

    rememberCheck.addEventListener('change', function() {
        if (this.checked == true) {
            localStorage.setItem('lyb_un', inputUn.value);
            localStorage.setItem('lyb_pwd', inputPwd.value);
        } else {
            localStorage.removeItem('lyb_un');
            localStorage.removeItem('lyb_pwd');
        }
    });

    if (inputUn.value != '') {
        let warn = inputUn.nextElementSibling.children[0];
        warn.innerHTML = '';
    }

    if (inputPwd.value != '') {
        let warn = inputPwd.nextElementSibling.children[0];
        warn.innerHTML = '';
    }

    var qqnumber = '';
    var username = '';
    var avatar = '';

    // ????????????
    submitLogin.addEventListener('click', function() {
        if (inputUn.value != '' && inputPwd.value != '') {
            let user = {
                id: '',
                username: inputUn.value,
                password: inputPwd.value,
                qq: ''
            }

            let jsonData = JSON.stringify(user);
            ajax.post({
                url: "http://39.108.62.108/user/login/",
                data: jsonData,
                onSuccess: function(result) {
                    let data = JSON.parse(result);
                    if (data.data != null) {
                        username = data.data.username;
                        qqnumber = data.data.qq;
                        nameUser.innerHTML = '??????????????????, ' + username;
                        if (qqnumber == '')
                            avatar = '../img/huaji.png';
                        else
                            avatar = 'http://q2.qlogo.cn/headimg_dl?dst_uin=' + qqnumber;
                        imgUser.src = qqnumber == '' ? avatar : avatar + '&spec=3';
                        isLogin = true;
                        login.style.display = 'none';
                    } else {
                        vm.openPromptMessage(data.msg, 'error');
                    }
                }
            });
        } else {
            vm.openPromptMessage('???????????????????????????', 'error');
        }
    });

    const flashBtn = messageArea.querySelector('.flashBtn');
    flashBtn.addEventListener('click', function() {
        vm.selectAll();
    })

    // ????????????
    const texts = textArea.querySelector('.texts');
    const submitMessage = textArea.querySelector('.submitMessage');
    submitMessage.addEventListener('click', function() {
        if (!isLogin) {
            vm.openPromptMessage('??????????????????', 'warning');
            return;
        }

        let files = vm.fileList;
        if (texts.value == '' && files.length == 0)
            vm.openPromptMessage('??????????????????', 'warning');
        else {
            vm.writer = {
                id: '',
                floor: '',
                qq: qqnumber,
                username: username,
                avatar: avatar,
                writeTime: getCurrentDate(),
                message: texts.value
            }

            if (files.length > 0) {
                vm.submitUploadPic();
            } else {
                let jsonData = JSON.stringify(vm.writer);
                ajax.post({
                    url: "http://39.108.62.108/msg/",
                    data: jsonData,
                    onSuccess: function(result) {
                        if (result == true) {
                            vm.writer = {
                                id: '',
                                floor: '',
                                qq: '',
                                username: '',
                                avatar: '',
                                writeTime: '',
                                message: ''
                            }
                            vm.selectAll();
                        }
                    }
                });
            }
            texts.value = '';
        }
    });

    //????????????
    const register = this.document.querySelector('.register');
    const infoBoard = register.querySelector('.infoBoard');

    const regUn = infoBoard.querySelector('#reg_un');
    const regPwd = infoBoard.querySelector('#reg_pwd');
    const regQQ = infoBoard.querySelector('#qq');
    const regSubmit = infoBoard.querySelector('.submitBtn');
    const regReturn = infoBoard.querySelector('.returnBtn');

    var checkUsername = false;
    var checkPassword = false;
    var checkQQ = true;
    var user = {
        id: '',
        username: '',
        password: '',
        qq: ''
    }

    regUn.addEventListener('blur', function() {
        let warn = this.nextElementSibling.children[0];
        if (this.value == '') {
            warn.innerHTML = '?????????????????????';
            if (checkUsername == true)
                checkUsername = false;
        } else {
            ajax.get({
                url: "http://39.108.62.108/user/username=" + this.value,
                onSuccess: function(result) {
                    let data = JSON.parse(result);
                    if (data.data == true) {
                        warn.innerHTML = '??????????????????';
                        if (checkUsername == true)
                            checkUsername = false;
                    } else {
                        warn.innerHTML = '';
                        if (checkUsername == false)
                            checkUsername = true;
                    }
                }
            });
        }
    });

    regPwd.addEventListener('blur', function() {
        let warn = this.nextElementSibling.children[0];
        if (this.value == '') {
            warn.innerHTML = '??????????????????';
            if (checkPassword == true)
                checkPassword = false;
        } else {
            warn.innerHTML = '';
            if (checkPassword == false)
                checkPassword = true;
        }
    })

    regQQ.addEventListener('blur', function() {
        let warn = this.nextElementSibling.children[0];
        if (this.value == '') {
            warn.innerHTML = '???????????????????????????';
            if (checkQQ == false)
                checkQQ = true;
        } else {
            ajax.get({
                url: "http://39.108.62.108/user/qq=" + this.value,
                onSuccess: function(result) {
                    let data = JSON.parse(result);
                    if (data.data == true) {
                        warn.innerHTML = '??????QQ???????????????';
                        if (checkQQ == true)
                            checkQQ = false;
                    } else {
                        warn.innerHTML = '';
                        if (checkQQ == false)
                            checkQQ = true;
                    }
                }
            });
        }
    });

    regSubmit.addEventListener('click', function() {
        if (checkUsername && checkQQ) {
            user.username = regUn.value;
            user.password = regPwd.value;
            user.qq = regQQ.value;

            let jsonData = JSON.stringify(user);
            ajax.post({
                url: "http://39.108.62.108/user/register/",
                data: jsonData,
                onSuccess: function(result) {
                    let data = JSON.parse(result);
                    if (data.data == true) {
                        vm.openPromptMessage(data.msg, 'success');
                        register.style.display = 'none';
                    } else 
                        vm.openPromptMessage(data.msg, 'error');
                }
            });
        } else {
            vm.openPromptMessage('???????????????', 'error');
        }
    });

    registerBtn.addEventListener('click', function() {
        register.style.display = 'flex';
    });

    regReturn.addEventListener('click', function() {
        register.style.display = 'none';
    });
});

function getCurrentDate() {
    let nowTime = new Date();
    let fullYear = nowTime.getFullYear();
    let month = nowTime.getMonth();
    month = month + 1;
    let date = nowTime.getDate();
    let hour = nowTime.getHours();
    hour = hour < 10 ? '0' + hour : hour;
    let minute = nowTime.getMinutes();
    minute = minute < 10 ? '0' + minute : minute;
    let second = nowTime.getSeconds();
    second = second < 10 ? '0' + second : second;
    return fullYear + '???' + month + '???' +  date + '???' + hour + ':' + minute + ':' + second;
}