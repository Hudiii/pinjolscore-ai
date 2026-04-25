<?php

namespace App\Http\Controllers;

use App\Models\LoanAnalysis;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class LoanAnalysisController extends Controller
{
    public function index()
    {
        $analyses = LoanAnalysis::orderBy('created_at', 'desc')->get();
        return response()->json($analyses);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'nama' => 'required|string',
                'pendapatan_bulanan' => 'required|numeric',
                'jumlah_pinjaman' => 'required|numeric',
                'tenor' => 'required|integer',
                'skor_ai' => 'required|integer',
                // Optional fields
                'usia' => 'nullable|integer',
                'status_pekerjaan' => 'nullable|string',
                'pengeluaran_bulanan' => 'nullable|numeric',
                'jumlah_pinjaman_aktif' => 'nullable|integer',
                'total_hutang_berjalan' => 'nullable|numeric',
                'riwayat_galbay_30_hari' => 'nullable|integer',
            ]);

            // Default values
            $validated['usia'] = $validated['usia'] ?? 30;
            $validated['status_pekerjaan'] = $validated['status_pekerjaan'] ?? 'Tetap';
            $validated['pengeluaran_bulanan'] = $validated['pengeluaran_bulanan'] ?? 0;
            $validated['jumlah_pinjaman_aktif'] = $validated['jumlah_pinjaman_aktif'] ?? 0;
            $validated['total_hutang_berjalan'] = $validated['total_hutang_berjalan'] ?? 0;
            $validated['riwayat_galbay_30_hari'] = $validated['riwayat_galbay_30_hari'] ?? 0;

            // Generate user_id
            $count = LoanAnalysis::count() + 1;
            $validated['user_id'] = 'USR-' . str_pad($count, 3, '0', STR_PAD_LEFT);

            // DTI Logic
            $validated['cicilan_bulanan'] = $validated['jumlah_pinjaman'] / $validated['tenor'];
            $validated['dti_ratio'] = ($validated['cicilan_bulanan'] / $validated['pendapatan_bulanan']) * 100;

            if ($validated['dti_ratio'] < 30) {
                $validated['kategori_risiko'] = 'Low Risk';
            } elseif ($validated['dti_ratio'] <= 50) {
                $validated['kategori_risiko'] = 'Medium Risk';
            } else {
                $validated['kategori_risiko'] = 'High Risk';
            }

            // AI Status Logic
            if ($validated['skor_ai'] > 700) {
                $validated['status_rekomendasi'] = 'Sangat Layak';
            } elseif ($validated['skor_ai'] > 550) {
                $validated['status_rekomendasi'] = 'Layak dengan Catatan';
            } else {
                $validated['status_rekomendasi'] = 'Beresiko Tinggi';
            }

            $analysis = LoanAnalysis::create($validated);

            return response()->json([
                'message' => 'Data analisis berhasil disimpan',
                'data' => $analysis
            ], 201);
            
        } catch (\Exception $e) {
            Log::error('Error storing analysis: ' . $e->getMessage());
            return response()->json(['message' => 'Terjadi kesalahan: ' . $e->getMessage()], 500);
        }
    }
}
