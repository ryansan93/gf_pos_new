<div class="col-md-12 no-padding detail div_pagination" data-jmlpage="<?php echo $jml_page; ?>">
    <nav aria-label="Navigasi halaman">
        <ul class="pagination">
            <li class="sebelumnya cursor-p"><a href="#">&laquo; Sebelumnya</a></li>
            <?php for ($i=1; $i <= $jml_page; $i++) { ?>
                <?php if ( $jml_page > 6 ) { ?>
                    <?php if ( $i == $jml_page) { ?>
                        <li class="ellipsis_end"><a href="#" class="disabled">...</a></li>
                    <?php } ?>
                <?php } ?>
                <?php
                    $hide_btn = 'hide';
                    if ( $jml_page > 6 ) {
                        if ( $i == 1 || $i == $jml_page || $i <= 5 ) {
                            $hide_btn = '';
                        }
                    } else {
                        $hide_btn = '';
                    }

                    $class_first = '';
                    $class_last = '';
                    if ( $i == 1 ) {
                        $class_first = 'first';
                    }

                    if ( $i == $jml_page ) {
                        $class_last = 'last';
                    }
                ?>
                <li class="<?php echo ($i == 1) ? 'active' : ''; ?> <?php echo $hide_btn; ?> <?php echo $class_first; ?> <?php echo $class_last; ?> cursor-p"><a onclick="mbr.paginationClick(this)" data-page="<?php echo $i; ?>"><?php echo $i; ?></a></li>
                <?php if ( $jml_page > 6 ) { ?>
                    <?php if ( $i == 1) { ?>
                        <li class="ellipsis_start hide"><a href="#" class="disabled">...</a></li>
                    <?php } ?>
                <?php } ?>
            <?php } ?>
            <li class="berikutnya cursor-p"><a href="#">Berikutnya &raquo;</a></li>
        </ul>
    </nav>
</div>