var mbr = {
	// startUp: function () {
	// }, // end - startUp

    filter_all: function (elm) {
        var _target = $(elm).data('target');

        var _div_target = $('.'+_target);
        var _div = $(_div_target).find('div.detail');
        var _content, _target;

        _div.show();
        _content = $(elm).val().toUpperCase().trim();

        if (!empty(_content) && _content != '') {
            $.map( $(_div), function(div){

                // CEK DI TR ADA ATAU TIDAK
                var ada = 0;
                $.map( $(div).find('.search'), function(div_val){
                    var _div_val = $(div_val).find('label').html().trim();
                    var _sensitive = $(div_val).attr('data-sensitive');

                    if ( _sensitive == 'false' ) {
                        if (_div_val.toUpperCase().indexOf(_content) > -1) {
                            ada = 1;
                        }
                    } else {
                        if (_div_val.toUpperCase() == _content) {
                            ada = 1;
                        }
                    }
                });

                if ( ada == 0 ) {
                    $(div).hide();
                } else {
                    $(div).show();
                };
            });
        }
    }, // end - filter_all

	modalMember: function () {
		$('.modal').modal('hide');

        $.get('master/Member/modalMember',{
        },function(data){
            var _options = {
                className : 'large',
                message : data,
                addClass : 'form',
                onEscape: true,
            };
            bootbox.dialog(_options).bind('shown.bs.modal', function(){
                $(this).css({'height': '100%'});
                $(this).find('.modal-header').css({'padding-top': '0px'});
                $(this).find('.modal-dialog').css({'width': '90%', 'max-width': '100%'});
                $(this).find('.modal-dialog').css({'height': '100%'});
                $(this).find('.modal-content').css({'width': '100%', 'max-width': '100%'});
                $(this).find('.modal-content').css({'height': '90%'});
                $(this).find('.modal-body').css({'height': '100%'});
                $(this).find('.bootbox-body').css({'height': '100%'});
                $(this).find('.bootbox-body .modal-body').css({'height': '100%'});
                $(this).find('.bootbox-body .modal-body .row').css({'height': '100%'});

                $('input').keyup(function(){
                    $(this).val($(this).val().toUpperCase());
                });

                $('[data-tipe=integer],[data-tipe=angka],[data-tipe=decimal]').each(function(){
                    // $(this).priceFormat(Config[$(this).data('tipe')]);
                    priceFormat( $(this) );
                });

                var modal_dialog = $(this).find('.modal-dialog');
                var div = $(modal_dialog).find('.list_member');

                mbr.pagination( $(this) );
            });
        },'html');
	}, // end - modalMember

    pagination: function(elm) {
        var modal = $(elm).closest('.modal');

        var params = {
            'grup': $(modal).find('input.grup').val(),
            'nama': $(modal).find('input.nama').val(),
            'no_telp': $(modal).find('input.no_telp').val(),
        };

        var dcontent = $('.modal').find('div.list_member div.pagination');

        $.ajax({
            url: 'master/Member/pagination',
            data: {
                'params': params
            },
            type: 'GET',
            dataType: 'HTML',
            beforeSend: function() {},
            success: function(html) {
                $(dcontent).html( html );

                mbr.getListsMember( $(dcontent).find('li.active a') );
            }
        });
    }, // end - pagination

    paginationClick: function(elm) {
        var ul = $(elm).closest('ul');
        var li = $(elm).closest('li');
        var div_pagination = $(elm).closest('div.div_pagination');

        var jml_page = $(div_pagination).attr('data-jmlpage');

        var prev_page = $(ul).find('li.active a').attr('data-page');
        var next_page = $(li).find('a').attr('data-page');

        if ( next_page >= 5 && Math.abs(next_page - jml_page) >= 5 ) {
            var page = $(li);
            var page_prev = $(li).prev('li');
            var page_next = $(li).next('li');

            $(ul).find('li').addClass('hide');

            $(page).removeClass('hide');
            $(page_prev).removeClass('hide');
            $(page_next).removeClass('hide');

            $(ul).find('li.sebelumnya').removeClass('hide');
            $(ul).find('li.berikutnya').removeClass('hide');

            $(ul).find('li.ellipsis_start').removeClass('hide');
            $(ul).find('li.ellipsis_end').removeClass('hide');

            $(ul).find('li.first').removeClass('hide');
            $(ul).find('li.last').removeClass('hide');
        } else {
            /* jika klik page lebih besar dari sebelumnya */
            if ( prev_page < next_page ) {
                $(ul).find('li').addClass('hide');

                if ( next_page > 5 ) {
                    $(ul).find('a[data-page='+(jml_page-1)+']').closest('li').removeClass('hide');
                    $(ul).find('a[data-page='+(jml_page-2)+']').closest('li').removeClass('hide');
                    $(ul).find('a[data-page='+(jml_page-3)+']').closest('li').removeClass('hide');
                    $(ul).find('a[data-page='+(jml_page-4)+']').closest('li').removeClass('hide');
                    $(ul).find('a[data-page='+(jml_page-5)+']').closest('li').removeClass('hide');
                    
                    $(ul).find('li.ellipsis_start').removeClass('hide');
                    $(ul).find('li.ellipsis_end').addClass('hide');
                } else {
                    $(ul).find('a[data-page=1]').closest('li').removeClass('hide');
                    $(ul).find('a[data-page=2]').closest('li').removeClass('hide');
                    $(ul).find('a[data-page=3]').closest('li').removeClass('hide');
                    $(ul).find('a[data-page=4]').closest('li').removeClass('hide');
                    $(ul).find('a[data-page=5]').closest('li').removeClass('hide');

                    $(ul).find('li.ellipsis_start').addClass('hide');
                    $(ul).find('li.ellipsis_end').removeClass('hide');
                }

                // $(ul).find('li.ellipsis_start').addClass('hide');
                // $(ul).find('li.ellipsis_end').removeClass('hide');

                $(ul).find('li.sebelumnya').removeClass('hide');
                $(ul).find('li.berikutnya').removeClass('hide');

                $(ul).find('li.first').removeClass('hide');
                $(ul).find('li.last').removeClass('hide');
            }
    
            /* jika klik page lebih kecil dari sebelumnya */
            if ( prev_page > next_page ) {
                $(ul).find('li').addClass('hide');

                if ( next_page > 5 ) {
                    $(ul).find('a[data-page='+(jml_page-1)+']').closest('li').removeClass('hide');
                    $(ul).find('a[data-page='+(jml_page-2)+']').closest('li').removeClass('hide');
                    $(ul).find('a[data-page='+(jml_page-3)+']').closest('li').removeClass('hide');
                    $(ul).find('a[data-page='+(jml_page-4)+']').closest('li').removeClass('hide');
                    $(ul).find('a[data-page='+(jml_page-5)+']').closest('li').removeClass('hide');

                    $(ul).find('li.ellipsis_start').removeClass('hide');
                    $(ul).find('li.ellipsis_end').addClass('hide');
                } else {
                    $(ul).find('a[data-page=1]').closest('li').removeClass('hide');
                    $(ul).find('a[data-page=2]').closest('li').removeClass('hide');
                    $(ul).find('a[data-page=3]').closest('li').removeClass('hide');
                    $(ul).find('a[data-page=4]').closest('li').removeClass('hide');
                    $(ul).find('a[data-page=5]').closest('li').removeClass('hide');

                    $(ul).find('li.ellipsis_start').addClass('hide');
                    $(ul).find('li.ellipsis_end').removeClass('hide');
                }

                // $(ul).find('li.ellipsis_start').removeClass('hide');
                // $(ul).find('li.ellipsis_end').addClass('hide');

                $(ul).find('li.sebelumnya').removeClass('hide');
                $(ul).find('li.berikutnya').removeClass('hide');

                $(ul).find('li.first').removeClass('hide');
                $(ul).find('li.last').removeClass('hide');
            }
        }

        $(ul).find('li').removeClass('active');
        $(li).addClass('active');

        mbr.getListsMember( elm );
    }, // end - paginationClick

    getListsMember: function(elm = null) {
        var modal = $(elm).closest('.modal');
        var page_num = $(elm).attr('data-page');

        var params = {
            'grup': $(modal).find('input.grup').val(),
            'nama': $(modal).find('input.nama').val(),
            'no_telp': $(modal).find('input.no_telp').val(),
            'page_num': page_num
        };

        var dcontent = $('.modal').find('div.list_member div.list');

        $.ajax({
            url: 'master/Member/getListsMember',
            data: {
                'params': params
            },
            type: 'GET',
            dataType: 'HTML',
            beforeSend: function() { App.showLoaderInContent( $(dcontent) ); },
            success: function(html) {
                App.hideLoaderInContent( $(dcontent), html );

                $(dcontent).find('.btn_pilih').click(function() {mbr.pilihMember( $(this) ); });
            }
        });
    }, // end - getListsMember

    pilihMember: function(elm) {
        var div = $(elm).closest('div.detail');

        kode_member = $(div).find('.kode label').text().toUpperCase();
        member = $(div).find('.nama label').text().toUpperCase();

        $('.member').attr('data-kode', kode_member);
        $('.member').text(member+' (MEMBER)');
        $('.list_menu').find('.jenis_pesanan').attr('data-kode', jenis_pesanan);
        $('.list_menu').find('.jenis_pesanan').text(nama_jenis_pesanan);

        $.map( $('div.kategori').find('ul.kategori li'), function(li) {
            var kategori = $(li).text();

            if ( kategori == 'PAKET' ) {
                $(li).click();
            }
        });

        $('.list_diskon').find('div.diskon[data-member=0]').remove();
        jual.hitDiskon();

        $('.modal').modal('hide');
    }, // end - pilihMember

    addForm: function () {
        $('.modal').modal('hide');

        $.get('master/Member/addForm',{
        },function(data){
            var _options = {
                className : 'large',
                message : data,
                addClass : 'form',
                onEscape: true,
            };
            bootbox.dialog(_options).bind('shown.bs.modal', function(){
                $(this).find('.modal-header').css({'padding-top': '0px'});
                $(this).find('.modal-dialog').css({'width': '40%', 'max-width': '100%'});

                $('input').keyup(function(){
                    $(this).val($(this).val().toUpperCase());
                });

                $('[data-tipe=integer],[data-tipe=angka],[data-tipe=decimal]').each(function(){
                    // $(this).priceFormat(Config[$(this).data('tipe')]);
                    priceFormat( $(this) );
                });

                $(this).find('.close').on('click', function() {
                    mbr.modalMember();
                });

                $(this).find('.member_group').select2();
                $(this).removeAttr('tabindex');
            });
        },'html');
    }, // end - addForm

    viewForm: function (elm) {
        $('.modal').modal('hide');

        $.get('master/Member/viewForm',{
            'kode': $(elm).data('kode')
        },function(data){
            var _options = {
                className : 'large',
                message : data,
                addClass : 'form',
                onEscape: true,
            };
            bootbox.dialog(_options).bind('shown.bs.modal', function(){
                $(this).find('.modal-header').css({'padding-top': '0px'});
                $(this).find('.modal-dialog').css({'width': '40%', 'max-width': '100%'});

                $('input').keyup(function(){
                    $(this).val($(this).val().toUpperCase());
                });

                $('[data-tipe=integer],[data-tipe=angka],[data-tipe=decimal]').each(function(){
                    // $(this).priceFormat(Config[$(this).data('tipe')]);
                    priceFormat( $(this) );
                });

                $(this).find('.close').on('click', function() {
                    mbr.modalMember();
                });

                $(this).find('.member_group').select2();
                $(this).removeAttr('tabindex');
            });
        },'html');
    }, // end - viewForm

    editForm: function (elm) {
        var modal = $(elm).closest('.modal');

        $(modal).find('input, select, textarea').removeAttr('disabled');
        $(modal).find('.btn_view').addClass('hide');
        $(modal).find('.btn_edit').removeClass('hide');
    }, // end - editForm

    batalEdit: function(elm) {
        mbr.viewForm($(elm));
    }, // end - batalEdit

    save: function(elm) {
        var modal = $(elm).closest('.modal');

        var err = 0;

        $.map( $(modal).find('[data-required=1]'), function(ipt) {
            if ( empty( $(ipt).val() ) ) {
                $(ipt).parent().addClass('has-error');
                err++;
            } else {
                $(ipt).parent().removeClass('has-error');
            }
        });

        if ( err == 0 ) {
            bootbox.confirm('Apakah anda yakin ingin menyimpan data member ?', function( result ) {
                if ( result ) {
                    var params = {
                        'nama': $(modal).find('.nama').val(),
                        'no_telp': $(modal).find('.no_telp').val(),
                        'alamat': $(modal).find('.alamat').val(),
                        'privilege': $(modal).find('[name=optradio]:checked').val(),
                        'member_group_id': $(modal).find('.member_group').val()
                    };

                    $.ajax({
                        url: 'master/Member/save',
                        data: {
                            'params': params
                        },
                        type: 'POST',
                        dataType: 'JSON',
                        beforeSend: function() { showLoading(); },
                        success: function(data) {
                            hideLoading();

                            if ( data.status == 1 ) {
                                bootbox.alert(data.message, function() {
                                    mbr.modalMember();
                                });
                            } else {
                                bootbox.alert(data.message);
                            }
                        }
                    });
                }
            });
        }
    }, // end - save

    edit: function(elm) {
        var modal = $(elm).closest('.modal');

        var err = 0;

        $.map( $(modal).find('[data-required=1]'), function(ipt) {
            if ( empty( $(ipt).val() ) ) {
                $(ipt).parent().addClass('has-error');
                err++;
            } else {
                $(ipt).parent().removeClass('has-error');
            }
        });

        if ( err == 0 ) {
            bootbox.confirm('Apakah anda yakin ingin meng-ubah data member ?', function( result ) {
                if ( result ) {
                    var params = {
                        'kode': $(elm).data('kode'),
                        'nama': $(modal).find('.nama').val(),
                        'no_telp': $(modal).find('.no_telp').val(),
                        'alamat': $(modal).find('.alamat').val(),
                        'privilege': $(modal).find('[name=optradio]:checked').val(),
                        'member_group_id': $(modal).find('.member_group').val()
                    };

                    $.ajax({
                        url: 'master/Member/edit',
                        data: {
                            'params': params
                        },
                        type: 'POST',
                        dataType: 'JSON',
                        beforeSend: function() { showLoading(); },
                        success: function(data) {
                            hideLoading();

                            if ( data.status == 1 ) {
                                bootbox.alert(data.message, function() {
                                    mbr.modalMember();
                                });
                            } else {
                                bootbox.alert(data.message);
                            }
                        }
                    });
                }
            });
        }
    }, // end - edit

    delete: function(elm) {
        bootbox.confirm('Apakah anda yakin ingin meng-hapus data member ?', function( result ) {
            if ( result ) {
                var params = {
                    'kode': $(elm).data('kode')
                };

                $.ajax({
                    url: 'master/Member/delete',
                    data: {
                        'params': params
                    },
                    type: 'POST',
                    dataType: 'JSON',
                    beforeSend: function() { showLoading(); },
                    success: function(data) {
                        hideLoading();

                        if ( data.status == 1 ) {
                            bootbox.alert(data.message, function() {
                                mbr.modalMember();
                            });
                        } else {
                            bootbox.alert(data.message);
                        }
                    }
                });
            }
        });
    }, // end - delete

    aktif: function (elm) {
        bootbox.confirm('Apakah anda yakin ingin meng aktifkan data member ?', function( result ) {
            if ( result ) {
                var params = {
                    'kode': $(elm).data('kode')
                };

                $.ajax({
                    url: 'master/Member/aktif',
                    data: {
                        'params': params
                    },
                    type: 'POST',
                    dataType: 'JSON',
                    beforeSend: function() { showLoading(); },
                    success: function(data) {
                        hideLoading();

                        if ( data.status == 1 ) {
                            bootbox.alert(data.message, function() {
                                mbr.modalMember();
                            });
                        } else {
                            bootbox.alert(data.message);
                        }
                    }
                });
            }
        });
    }, // end - nonAktif

    nonAktif: function (elm) {
        bootbox.confirm('Apakah anda yakin ingin menonaktifkan data member ?', function( result ) {
            if ( result ) {
                var params = {
                    'kode': $(elm).data('kode')
                };

                $.ajax({
                    url: 'master/Member/nonAktif',
                    data: {
                        'params': params
                    },
                    type: 'POST',
                    dataType: 'JSON',
                    beforeSend: function() { showLoading(); },
                    success: function(data) {
                        hideLoading();

                        if ( data.status == 1 ) {
                            bootbox.alert(data.message, function() {
                                mbr.modalMember();
                            });
                        } else {
                            bootbox.alert(data.message);
                        }
                    }
                });
            }
        });
    }, // end - nonAktif

    modalSaldoMember: function () {
        $('.modal').modal('hide');

        $.get('master/Member/modalSaldoMember',{
        },function(data){
            var _options = {
                className : 'large',
                message : data,
                addClass : 'form',
                onEscape: true,
            };
            bootbox.dialog(_options).bind('shown.bs.modal', function(){
                $(this).css({'height': '100%'});
                $(this).find('.modal-header').css({'padding-top': '0px'});
                $(this).find('.modal-dialog').css({'width': '70%', 'max-width': '100%'});
                $(this).find('.modal-dialog').css({'height': '100%'});
                $(this).find('.modal-content').css({'width': '100%', 'max-width': '100%'});
                $(this).find('.modal-content').css({'height': '90%'});
                $(this).find('.modal-body').css({'height': '100%'});
                $(this).find('.bootbox-body').css({'height': '100%'});
                $(this).find('.bootbox-body .modal-body').css({'height': '100%'});
                $(this).find('.bootbox-body .modal-body .row').css({'height': '100%'});

                $('input').keyup(function(){
                    $(this).val($(this).val().toUpperCase());
                });

                $('[data-tipe=integer],[data-tipe=angka],[data-tipe=decimal]').each(function(){
                    // $(this).priceFormat(Config[$(this).data('tipe')]);
                    priceFormat( $(this) );
                });

                var modal_dialog = $(this).find('.modal-dialog');
                var div = $(modal_dialog).find('.list_member');
            });
        },'html');
    }, // end - modalSaldoMember

    addSaldoForm: function () {
        $('.modal').modal('hide');

        $.get('master/Member/addSaldoForm',{
        },function(data){
            var _options = {
                className : 'large',
                message : data,
                addClass : 'form',
                onEscape: true,
            };
            bootbox.dialog(_options).bind('shown.bs.modal', function(){
                $(this).find('.modal-header').css({'padding-top': '0px'});

                $(this).find('.modal-dialog').css({'width': '40%', 'max-width': '100%'});

                $('input').keyup(function(){
                    $(this).val($(this).val().toUpperCase());
                });

                $('[data-tipe=integer],[data-tipe=angka],[data-tipe=decimal]').each(function(){
                    // $(this).priceFormat(Config[$(this).data('tipe')]);
                    priceFormat( $(this) );
                });

                $(this).find('.member').select2();
                $(this).removeAttr('tabindex');

                $(this).find('.close').on('click', function() {
                    mbr.modalSaldoMember();
                });
            });
        },'html');
    }, // end - addSaldoForm

    viewSaldoForm: function (elm) {
        $('.modal').modal('hide');

        $.get('master/Member/viewSaldoForm',{
            'kode': $(elm).data('kode')
        },function(data){
            var _options = {
                className : 'large',
                message : data,
                addClass : 'form',
                onEscape: true,
            };
            bootbox.dialog(_options).bind('shown.bs.modal', function(){
                $(this).find('.modal-header').css({'padding-top': '0px'});
                $(this).find('.modal-dialog').css({'width': '40%', 'max-width': '100%'});

                $('input').keyup(function(){
                    $(this).val($(this).val().toUpperCase());
                });

                $('[data-tipe=integer],[data-tipe=angka],[data-tipe=decimal]').each(function(){
                    // $(this).priceFormat(Config[$(this).data('tipe')]);
                    priceFormat( $(this) );
                });

                $(this).find('.close').on('click', function() {
                    mbr.modalSaldoMember();
                });
            });
        },'html');
    }, // end - viewSaldoForm

    editSaldoForm: function (elm) {
        var modal = $(elm).closest('.modal');

        $(modal).find('input, select').removeAttr('disabled');
        $(modal).find('.btn_view').addClass('hide');
        $(modal).find('.btn_edit').removeClass('hide');

        $(modal).find('.member').select2();
        $(modal).removeAttr('tabindex');
    }, // end - editSaldoForm

    batalEditSm: function(elm) {
        mbr.viewSaldoForm($(elm));
    }, // end - batalEditSm

    saveSm: function (elm) {
        var modal = $(elm).closest('.modal');

        var err = 0;

        $.map( $(modal).find('[data-required=1]'), function(ipt) {
            if ( empty( $(ipt).val() ) ) {
                $(ipt).parent().addClass('has-error');
                err++;
            } else {
                $(ipt).parent().removeClass('has-error');
            }
        });

        if ( err == 0 ) {
            bootbox.confirm('Apakah anda yakin ingin menyimpan data saldo member ?', function( result ) {
                if ( result ) {
                    var params = {
                        'kode_member': $(modal).find('.member').select2().val(),
                        'saldo': numeral.unformat($(modal).find('.saldo').val())
                    };

                    $.ajax({
                        url: 'master/Member/saveSm',
                        data: {
                            'params': params
                        },
                        type: 'POST',
                        dataType: 'JSON',
                        beforeSend: function() { showLoading(); },
                        success: function(data) {
                            hideLoading();

                            if ( data.status == 1 ) {
                                bootbox.alert(data.message, function() {
                                    mbr.modalSaldoMember();
                                });
                            } else {
                                bootbox.alert(data.message);
                            }
                        }
                    });
                }
            });
        }
    }, // end - saveSm

    editSm: function(elm) {
        var modal = $(elm).closest('.modal');

        var err = 0;

        $.map( $(modal).find('[data-required=1]'), function(ipt) {
            if ( empty( $(ipt).val() ) ) {
                $(ipt).parent().addClass('has-error');
                err++;
            } else {
                $(ipt).parent().removeClass('has-error');
            }
        });

        if ( err == 0 ) {
            bootbox.confirm('Apakah anda yakin ingin meng-ubah data saldo member ?', function( result ) {
                if ( result ) {
                    var params = {
                        'kode': $(elm).data('kode'),
                        'kode_member': $(modal).find('.member').select2().val(),
                        'saldo': numeral.unformat($(modal).find('.saldo').val())
                    };

                    $.ajax({
                        url: 'master/Member/editSm',
                        data: {
                            'params': params
                        },
                        type: 'POST',
                        dataType: 'JSON',
                        beforeSend: function() { showLoading(); },
                        success: function(data) {
                            hideLoading();

                            if ( data.status == 1 ) {
                                bootbox.alert(data.message, function() {
                                    mbr.modalSaldoMember();
                                });
                            } else {
                                bootbox.alert(data.message);
                            }
                        }
                    });
                }
            });
        }
    }, // end - editSm

    deleteSm: function(elm) {
        bootbox.confirm('Apakah anda yakin ingin meng-hapus data saldo member ?', function( result ) {
            if ( result ) {
                var params = {
                    'kode': $(elm).data('kode')
                };

                $.ajax({
                    url: 'master/Member/deleteSm',
                    data: {
                        'params': params
                    },
                    type: 'POST',
                    dataType: 'JSON',
                    beforeSend: function() { showLoading(); },
                    success: function(data) {
                        hideLoading();

                        if ( data.status == 1 ) {
                            bootbox.alert(data.message, function() {
                                mbr.modalSaldoMember();
                            });
                        } else {
                            bootbox.alert(data.message);
                        }
                    }
                });
            }
        });
    }, // end - deleteSm
};

// mbr.startUp();