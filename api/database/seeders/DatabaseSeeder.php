<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create an admin user for login
        User::firstOrCreate(
            ['email' => 'admin@pinjolscore.id'],
            [
                'name' => 'Analyst Admin',
                'password' => \Illuminate\Support\Facades\Hash::make('password')
            ]
        );

        $this->call([
            LoanAnalysisSeeder::class,
        ]);
    }
}
