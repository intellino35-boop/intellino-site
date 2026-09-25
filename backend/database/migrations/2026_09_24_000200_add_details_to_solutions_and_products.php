<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('solutions', function (Blueprint $table) {
            $table->text('description')->nullable()->after('title');
            $table->json('benefits')->nullable()->after('items');
        });

        Schema::table('products', function (Blueprint $table) {
            $table->text('details')->nullable()->after('description');
            $table->json('use_cases')->nullable()->after('features');
        });
    }

    public function down(): void
    {
        Schema::table('solutions', fn (Blueprint $table) => $table->dropColumn(['description', 'benefits']));
        Schema::table('products', fn (Blueprint $table) => $table->dropColumn(['details', 'use_cases']));
    }
};
