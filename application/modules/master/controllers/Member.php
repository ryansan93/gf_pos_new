<?php defined('BASEPATH') or exit('No direct script access allowed');

class Member extends Public_Controller
{
    private $pathView = 'master/member/';
    private $url;
    private $hakAkses;
    private $persen_ppn = 0;
    /**
     * Constructor
     */
    public function __construct()
    {
        parent::__construct();
        $this->url = $this->current_base_uri;
        $this->hasAkses = hakAkses($this->url);
    }

    public function modalMember()
    {
        $data = null;

        $content['akses'] = $this->hasAkses;
        $content['data'] = $data;

        $html = $this->load->view($this->pathView . 'modal_member', $content, TRUE);

        echo $html;
    }

    public function pagination()
    {
        $params = $this->input->get('params');

        $sql_condition = null;

        $grup = $params['grup'];
        if ( !empty($grup) && $grup != '' ) {
            if ( empty($sql_condition) ) {
                $sql_condition = "where mbr.mg_nama like '%".$grup."%'";
            } else {
                $sql_condition .= " and mbr.mg_nama like '%".$grup."%'";
            }
        }

        $nama = $params['nama'];
        if ( !empty($nama) && $nama != '' ) {
            if ( empty($sql_condition) ) {
                $sql_condition = "where mbr.nama like '%".$nama."%'";
            } else {
                $sql_condition .= " and mbr.nama like '%".$nama."%'";
            }
        }

        $no_telp = $params['no_telp'];
        if ( !empty($no_telp) && $no_telp != '' ) {
            if ( empty($sql_condition) ) {
                $sql_condition = "where mbr.no_telp like '%".$no_telp."%'";
            } else {
                $sql_condition .= " and mbr.no_telp like '%".$no_telp."%'";
            }
        }

        /* HITUNG PAGE */
        $m_member = new \Model\Storage\Conf();
        $sql = "
            select * from (
                select 
                    m.*,
                    mg.nama as mg_nama
                from member m
                left join
                    member_group mg 
                    on
                        m.member_group_id = mg.id
            ) mbr
            ".$sql_condition."
        ";
        $d_member = $m_member->hydrateRaw( $sql );

        $jml_data = 0;
        $jml_page = 0;
        if ( $d_member->count() > 0 ) {
            $jml_data = $d_member->count();
            $jml_page = ceil($jml_data/10);
        }
        /* END - HITUNG PAGE */

        $content['jml_data'] = $jml_data;
        $content['jml_page'] = $jml_page;
        $html = $this->load->view($this->pathView . 'pagination', $content, TRUE);

        echo $html;
    }

    public function getListsMember()
    {
        $params = $this->input->get('params');

        $sql_condition = null;

        $grup = $params['grup'];
        if ( !empty($grup) && $grup != '' ) {
            if ( empty($sql_condition) ) {
                $sql_condition = "where mbr.mg_nama like '%".$grup."%'";
            } else {
                $sql_condition .= " and mbr.mg_nama like '%".$grup."%'";
            }
        }

        $nama = $params['nama'];
        if ( !empty($nama) && $nama != '' ) {
            if ( empty($sql_condition) ) {
                $sql_condition = "where mbr.nama like '%".$nama."%'";
            } else {
                $sql_condition .= " and mbr.nama like '%".$nama."%'";
            }
        }

        $no_telp = $params['no_telp'];
        if ( !empty($no_telp) && $no_telp != '' ) {
            if ( empty($sql_condition) ) {
                $sql_condition = "where mbr.no_telp like '%".$no_telp."%'";
            } else {
                $sql_condition .= " and mbr.no_telp like '%".$no_telp."%'";
            }
        }

        $row_num_start = (!empty($params['page_num']) && isset($params['page_num'])) ? (($params['page_num']*10)-9) : ((1*10)-9);
        $row_num_end = $row_num_start+9; 

        /* GET DATA */
        $m_member = new \Model\Storage\Conf();
        $sql = "
            select * from
            (
                select
                    mbr.*,
    	            ROW_NUMBER() OVER (ORDER BY mbr.kode_member) AS row_num
                from (
                    select 
                        m.*,
                        mg.nama as mg_nama,
                        case
                            when GETDATE() > m.tgl_berakhir or m.mstatus = 0 then
                                'merah'
                            else
                                null
                        end as bg_color,
                        case
                            when GETDATE() > m.tgl_berakhir or m.mstatus = 0 then
                                'NON AKTIF'
                            else
                                'AKTIF'
                        end as status_aktif
                    from member m
                    left join
                        member_group mg 
                        on
                            m.member_group_id = mg.id
                ) mbr
                ".$sql_condition."
            ) data
            where
                data.row_num >= ".$row_num_start." and data.row_num <= ".$row_num_end."
        ";
        // cetak_r( $sql, 1 );
        $d_member = $m_member->hydrateRaw( $sql );

        $data = null;
        if ( $d_member->count() > 0 ) {
            $data = $d_member->toArray();
        }
        /* END - GET DATA */

        $content['data'] = $data;
        $html = $this->load->view($this->pathView . 'list_member', $content, TRUE);

        echo $html;
    }

    public function getDataMemberGroup()
    {
        $m_member_group = new \Model\Storage\MemberGroup_model();
        $d_member_group = $m_member_group->where('status', 1)->orderBy('nama', 'desc')->get();

        $data = null;
        if ( $d_member_group->count() > 0 ) {
            $data = $d_member_group->toArray();
        }

        return $data;
    }

    public function addForm()
    {
        $content['member_group'] = $this->getDataMemberGroup();

        $html = $this->load->view($this->pathView . 'add_form', $content, TRUE);

        echo $html;
    }

    public function viewForm()
    {
        $kode = $this->input->get('kode');

        $m_member = new \Model\Storage\Member_model();
        $now = $m_member->getDate();

        $d_member = $m_member->where('kode_member', $kode)->first();

        $data = null;
        if ( $d_member ) {
            $data = $d_member->toArray();
        }

        $content['akses'] = $this->hasAkses;
        $content['tanggal'] = $now['tanggal'];
        $content['member_group'] = $this->getDataMemberGroup();
        $content['data'] = $data;

        $html = $this->load->view($this->pathView . 'view_form', $content, TRUE);

        echo $html;
    }

    public function save()
    {
        $params = $this->input->post('params');
        try {
            $m_member = new \Model\Storage\Member_model();
            $now = $m_member->getDate();

            $kode_member = $m_member->getNextId();

            $m_member->kode_member = $kode_member;
            $m_member->nama = $params['nama'];
            $m_member->no_telp = $params['no_telp'];
            $m_member->alamat = $params['alamat'];
            $m_member->privilege = 0;
            $m_member->status = 1;
            $m_member->tgl_berakhir = prev_date(date('Y-m-d', strtotime($now['tanggal']. ' + 1 years')));
            $m_member->mstatus = 1;
            $m_member->member_group_id = $params['member_group_id'];
            $m_member->save();

            $d_member = $m_member->where('kode_member', $kode_member)->first()->toArray();

            $deskripsi_log = 'di-submit oleh ' . $this->userdata['detail_user']['nama_detuser'];
            Modules::run( 'base/event/save', $m_member, $deskripsi_log, $kode_member );
            
            $this->result['status'] = 1;
            $this->result['message'] = 'Data member berhasil di simpan.';
        } catch (Exception $e) {
            $this->result['message'] = $e->getMessage();
        }

        display_json( $this->result );
    }

    public function edit()
    {
        $params = $this->input->post('params');
        try {
            $m_member = new \Model\Storage\Member_model();

            $kode_member = $params['kode'];

            $m_member->where('kode_member', $kode_member)->update(
                array(
                    'nama' => $params['nama'],
                    'no_telp' => $params['no_telp'],
                    'alamat' => $params['alamat'],
                    'privilege' => $params['privilege'],
                    'member_group_id' => $params['member_group_id']
                )
            );

            $d_member = $m_member->where('kode_member', $kode_member)->first()->toArray();

            $deskripsi_log = 'di-update oleh ' . $this->userdata['detail_user']['nama_detuser'];
            Modules::run( 'base/event/update', $m_member, $deskripsi_log, $kode_member );
            
            $this->result['status'] = 1;
            $this->result['message'] = 'Data member berhasil di ubah.';
        } catch (Exception $e) {
            $this->result['message'] = $e->getMessage();
        }

        display_json( $this->result );
    }

    public function delete()
    {
        $params = $this->input->post('params');
        try {
            $m_member = new \Model\Storage\Member_model();

            $kode_member = $params['kode'];

            $m_member->where('kode_member', $kode_member)->update(
                array(
                    'status' => 0
                )
            );

            $d_member = $m_member->where('kode_member', $kode_member)->first()->toArray();

            $deskripsi_log = 'di-hapus oleh ' . $this->userdata['detail_user']['nama_detuser'];
            Modules::run( 'base/event/delete', $m_member, $deskripsi_log, $kode_member );
            
            $this->result['status'] = 1;
            $this->result['message'] = 'Data member berhasil di hapus.';
        } catch (Exception $e) {
            $this->result['message'] = $e->getMessage();
        }

        display_json( $this->result );
    }

    public function aktif()
    {
        $params = $this->input->post('params');
        try {
            $m_member = new \Model\Storage\Member_model();
            $now = $m_member->getDate();

            $kode_member = $params['kode'];

            $m_member->where('kode_member', $kode_member)->update(
                array(
                    'mstatus' => 1,
                    'tgl_berakhir' => prev_date(date('Y-m-d', strtotime($now['tanggal']. ' + 1 years')))
                )
            );

            $d_member = $m_member->where('kode_member', $kode_member)->first()->toArray();

            $deskripsi_log = 'di-aktifkan oleh ' . $this->userdata['detail_user']['nama_detuser'];
            Modules::run( 'base/event/update', $m_member, $deskripsi_log, $kode_member );
            
            $this->result['status'] = 1;
            $this->result['message'] = 'Data member berhasil di aktifkan.';
        } catch (Exception $e) {
            $this->result['message'] = $e->getMessage();
        }

        display_json( $this->result );
    }

    public function nonAktif()
    {
        $params = $this->input->post('params');
        try {
            $m_member = new \Model\Storage\Member_model();
            $now = $m_member->getDate();

            $kode_member = $params['kode'];

            $m_member->where('kode_member', $kode_member)->update(
                array(
                    'mstatus' => 0
                )
            );

            $d_member = $m_member->where('kode_member', $kode_member)->first()->toArray();

            $deskripsi_log = 'di-nonaktifkan oleh ' . $this->userdata['detail_user']['nama_detuser'];
            Modules::run( 'base/event/update', $m_member, $deskripsi_log, $kode_member );
            
            $this->result['status'] = 1;
            $this->result['message'] = 'Data member berhasil di nonaktifkan.';
        } catch (Exception $e) {
            $this->result['message'] = $e->getMessage();
        }

        display_json( $this->result );
    }

    public function getMember()
    {
        $m_member = new \Model\Storage\Member_model();
        $d_member = $m_member->where('status', 1)->get();

        $data = null;
        if ( $d_member->count() > 0 ) {
            $data = $d_member->toArray();
        }

        return $data;
    }

    public function modalSaldoMember()
    {
        $m_sm = new \Model\Storage\SaldoMember_model();
        $d_sm = $m_sm->where('status', 1)->with(['member'])->get();

        $data = null;
        if ( $d_sm->count() > 0 ) {
            $data = $d_sm->toArray();
        }

        $content['data'] = $data;

        $html = $this->load->view($this->pathView . 'modal_saldo_member', $content, TRUE);

        echo $html;
    }

    public function addSaldoForm()
    {
        $content['member'] = $this->getMember();

        $html = $this->load->view($this->pathView . 'add_saldo_form', $content, TRUE);

        echo $html;
    }

    public function viewSaldoForm()
    {
        $kode = $this->input->get('kode');

        $m_sm = new \Model\Storage\SaldoMember_model();
        $d_sm = $m_sm->where('id', $kode)->first();

        $data = null;
        if ( $d_sm ) {
            $data = $d_sm->toArray();
        }

        $content['data'] = $data;
        $content['member'] = $this->getMember();

        $html = $this->load->view($this->pathView . 'view_saldo_form', $content, TRUE);

        echo $html;
    }

    public function saveSm()
    {
        $params = $this->input->post('params');
        try {
            $m_sm = new \Model\Storage\SaldoMember_model();

            $m_sm->member_kode = $params['kode_member'];
            $m_sm->saldo = $params['saldo'];
            $m_sm->sisa_saldo = $params['saldo'];
            $m_sm->status = 1;
            $m_sm->save();

            $deskripsi_log = 'di-submit oleh ' . $this->userdata['detail_user']['nama_detuser'];
            Modules::run( 'base/event/save', $m_sm, $deskripsi_log );
            
            $this->result['status'] = 1;
            $this->result['message'] = 'Data member berhasil di simpan.';
        } catch (Exception $e) {
            $this->result['message'] = $e->getMessage();
        }

        display_json( $this->result );
    }

    public function editSm()
    {
        $params = $this->input->post('params');
        try {
            $m_sm = new \Model\Storage\SaldoMember_model();

            $m_sm->where('id', $params['kode'])->update(
                array(
                    'member_kode' => $params['kode_member'],
                    'saldo' => $params['saldo']
                )
            );

            $d_sm = $m_sm->where('id', $params['kode'])->first();

            $deskripsi_log = 'di-submit oleh ' . $this->userdata['detail_user']['nama_detuser'];
            Modules::run( 'base/event/save', $d_sm, $deskripsi_log );
            
            $this->result['status'] = 1;
            $this->result['message'] = 'Data member berhasil di ubah.';
        } catch (Exception $e) {
            $this->result['message'] = $e->getMessage();
        }

        display_json( $this->result );
    }

    public function deleteSm()
    {
        $params = $this->input->post('params');
        try {
            $m_sm = new \Model\Storage\SaldoMember_model();

            $id = $params['kode'];

            $m_sm->where('id', $id)->update(
                array(
                    'status' => 0
                )
            );

            $d_sm = $m_sm->where('id', $id)->first()->toArray();

            $deskripsi_log = 'di-hapus oleh ' . $this->userdata['detail_user']['nama_detuser'];
            Modules::run( 'base/event/delete', $m_sm, $deskripsi_log );
            
            $this->result['status'] = 1;
            $this->result['message'] = 'Data member berhasil di hapus.';
        } catch (Exception $e) {
            $this->result['message'] = $e->getMessage();
        }

        display_json( $this->result );
    }

    public function tes() {
        $m_member = new \Model\Storage\Member_model();
        $d_member = $m_member->where('status', 1)->orderBy('kode_member', 'desc')->with(['member_group'])->get();

        $data = null;
        if ( $d_member->count() > 0 ) {
            $data = $d_member->toArray();
        }
        
        cetak_r( $data );
    }
}