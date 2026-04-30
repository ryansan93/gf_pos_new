<?php if ( !empty($data) ): ?>
    <?php $idx = 1; ?>
    <?php foreach ($data as $key => $value): ?>
        <?php 
            $bgcolor = 'putih';
            if ( $idx % 2 == 0 ) {
                $bgcolor = 'abu';
            }

            if ( isset($value['bg_color']) && !empty($value['bg_color']) ) {
                $bgcolor = $value['bg_color'];
            }

            $idx++;
        ?>
        <div class="col-md-12 no-padding detail <?php echo $bgcolor; ?>">
            <div class="col-md-1 search kode" data-sensitive="false"><label class="label-control"><?php echo $value['kode_member']; ?></label></div>
            <div class="col-md-2 search grup" data-sensitive="false"><label class="label-control"><?php echo !empty($value['member_group_id']) ? $value['mg_nama'] : 'NON GRUP'; ?></label></div>
            <div class="col-md-2 search nama" data-sensitive="false"><label class="label-control"><?php echo $value['nama']; ?></label></div>
            <div class="col-md-2 search" data-sensitive="false"><label class="label-control"><?php echo $value['no_telp']; ?></label></div>
            <div class="col-md-2 search" data-sensitive="false"><label class="label-control"><?php echo tglIndonesia($value['tgl_berakhir'], '-', ' '); ?></label></div>
            <div class="col-md-1 search" data-sensitive="true">
                <label class="label-control">
                    <?php echo $value['status_aktif']; ?>
                </label>
            </div>
            <div class="col-md-2">
                <div class="col-md-6 no-padding">
                    <button type="button" class="btn btn-success col-md-12 btn_pilih" style="padding: 0px; margin-right: 5px;"><i class="fa fa-arrow-right"></i></button>
                </div>
                <div class="col-md-6 no-padding"><button type="button" class="btn btn-primary col-md-12" style="padding: 0px; margin-left: 5px;" onclick="bayar.pembayaranFormHutang(this)" data-kode="<?php echo exEncrypt($value['kode_member']); ?>"><i class="fa fa-usd"></i></button></div>
            </div>
        </div>
    <?php endforeach ?>
<?php else: ?>
    <div class="col-md-12 no-padding detail">
        <div class="col-md-12" style="border-bottom: none;"><label class="label-control">Data tidak ditemukan.</label></div>
    </div>
<?php endif ?>