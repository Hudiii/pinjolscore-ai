<?php

namespace Database\Seeders;

use App\Models\LoanAnalysis;
use Illuminate\Database\Seeder;

class LoanAnalysisSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $names = ['Budi', 'Siti', 'Andi', 'Dewi', 'Rian', 'Lia', 'Eko', 'Sari', 'Fajar', 'Maya', 
                 'Hadi', 'Rina', 'Deni', 'Tika', 'Agus', 'Indah', 'Bambang', 'Ani', 'Joko', 'Zaskia'];
        
        $jobStatuses = ['Tetap', 'Kontrak', 'Freelance', 'Tidak Bekerja'];

        for ($i = 0; $i < 20; $i++) {
            $pendapatan = rand(3000000, 15000000);
            $jumlahPinjaman = rand(5000000, 50000000);
            $tenor = rand(6, 36); // 6 to 36 months
            
            // DTI logic
            $cicilanBulanan = $jumlahPinjaman / $tenor;
            $dtiRatio = ($cicilanBulanan / $pendapatan) * 100;
            
            if ($dtiRatio < 30) {
                $kategoriRisiko = 'Low Risk';
            } elseif ($dtiRatio <= 50) {
                $kategoriRisiko = 'Medium Risk';
            } else {
                $kategoriRisiko = 'High Risk';
            }

            // AI score logic from user
            $skorAi = rand(300, 850);
            if ($skorAi > 700) {
                $statusRekomendasi = 'Sangat Layak';
            } elseif ($skorAi > 550) {
                $statusRekomendasi = 'Layak dengan Catatan';
            } else {
                $statusRekomendasi = 'Beresiko Tinggi';
            }

            LoanAnalysis::create([
                'user_id' => 'USR-' . str_pad($i + 1, 3, '0', STR_PAD_LEFT),
                'nama' => $names[$i],
                'usia' => rand(21, 50),
                'status_pekerjaan' => $jobStatuses[array_rand($jobStatuses)],
                'pendapatan_bulanan' => $pendapatan,
                'pengeluaran_bulanan' => rand(2000000, 8000000),
                'jumlah_pinjaman' => $jumlahPinjaman,
                'tenor' => $tenor,
                'jumlah_pinjaman_aktif' => rand(0, 5),
                'total_hutang_berjalan' => rand(0, 20000000),
                'riwayat_galbay_30_hari' => rand(0, 3),
                'cicilan_bulanan' => $cicilanBulanan,
                'dti_ratio' => $dtiRatio,
                'kategori_risiko' => $kategoriRisiko,
                'skor_ai' => $skorAi,
                'status_rekomendasi' => $statusRekomendasi
            ]);
        }
    }
}

