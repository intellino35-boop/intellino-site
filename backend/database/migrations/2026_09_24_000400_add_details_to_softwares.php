<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('softwares', function (Blueprint $table) {
            $table->text('details')->nullable()->after('description');
            $table->json('features')->nullable()->after('details');
            $table->json('audiences')->nullable()->after('features');
        });
    }

    public function down(): void
    {
        Schema::table('softwares', fn (Blueprint $table) => $table->dropColumn(['details', 'features', 'audiences']));
    }
};
