<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('loan_analyses', function (Blueprint $table) {
            $table->id();
            $table->string('user_id')->unique();
            $table->string('nama');
            $table->integer('usia');
            $table->string('status_pekerjaan');
            $table->decimal('pendapatan_bulanan', 15, 2);
            $table->decimal('pengeluaran_bulanan', 15, 2)->nullable();
            $table->decimal('jumlah_pinjaman', 15, 2);
            $table->integer('tenor'); // dalam bulan
            $table->integer('jumlah_pinjaman_aktif')->default(0);
            $table->decimal('total_hutang_berjalan', 15, 2)->default(0);
            $table->integer('riwayat_galbay_30_hari')->default(0);
            
            // Kalkulasi
            $table->decimal('cicilan_bulanan', 15, 2);
            $table->decimal('dti_ratio', 5, 2);
            $table->string('kategori_risiko'); // Low Risk, Medium Risk, High Risk
            $table->integer('skor_ai');
            $table->string('status_rekomendasi'); // Sangat Layak, Layak dengan Catatan, Beresiko Tinggi
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('loan_analyses');
    }
};
