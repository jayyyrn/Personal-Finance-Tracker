<?php

// Example Laravel API routes for Personal Finance Tracker
// This would go in routes/api.php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\BudgetController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AnalyticsController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
});

// Get public categories
Route::get('/categories', [CategoryController::class, 'index']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    
    // Auth routes
    Route::prefix('auth')->group(function () {
        Route::get('/user', [AuthController::class, 'user']);
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
    });

    // Dashboard
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);

    // Transactions
    Route::apiResource('transactions', TransactionController::class);
    Route::prefix('transactions')->group(function () {
        Route::get('/export', [TransactionController::class, 'export']);
        Route::post('/import', [TransactionController::class, 'import']);
    });

    // Budgets
    Route::apiResource('budgets', BudgetController::class);
    Route::get('/budgets/overview', [BudgetController::class, 'overview']);

    // Categories (user can create custom categories)
    Route::prefix('categories')->group(function () {
        Route::post('/', [CategoryController::class, 'store']);
        Route::put('/{category}', [CategoryController::class, 'update']);
        Route::delete('/{category}', [CategoryController::class, 'destroy']);
    });

    // Analytics
    Route::prefix('analytics')->group(function () {
        Route::get('/category-stats', [AnalyticsController::class, 'categoryStats']);
        Route::get('/monthly-stats', [AnalyticsController::class, 'monthlyStats']);
        Route::get('/spending-trends', [AnalyticsController::class, 'spendingTrends']);
        Route::get('/budget-performance', [AnalyticsController::class, 'budgetPerformance']);
    });
});

// Example Controller Methods:

/*
// TransactionController.php
class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $query = Transaction::with('category')
            ->where('user_id', $request->user()->id);

        // Apply filters
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('date_from')) {
            $query->where('transaction_date', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->where('transaction_date', '<=', $request->date_to);
        }

        if ($request->has('search')) {
            $query->where('description', 'LIKE', '%' . $request->search . '%');
        }

        $transactions = $query->orderBy('transaction_date', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json([
            'status' => 'success',
            'data' => $transactions
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:income,expense',
            'amount' => 'required|numeric|min:0.01',
            'category_id' => 'required|exists:categories,id',
            'description' => 'required|string|max:1000',
            'transaction_date' => 'required|date'
        ]);

        $transaction = Transaction::create([
            ...$validated,
            'user_id' => $request->user()->id
        ]);

        return response()->json([
            'status' => 'success',
            'data' => $transaction->load('category'),
            'message' => 'Transaction created successfully'
        ], 201);
    }
}

// DashboardController.php
class DashboardController extends Controller
{
    public function stats(Request $request)
    {
        $user = $request->user();
        
        $stats = [
            'total_income' => Transaction::where('user_id', $user->id)
                ->where('type', 'income')
                ->sum('amount'),
            
            'total_expenses' => Transaction::where('user_id', $user->id)
                ->where('type', 'expense')
                ->sum('amount'),
            
            'monthly_income' => Transaction::where('user_id', $user->id)
                ->where('type', 'income')
                ->whereMonth('transaction_date', now()->month)
                ->whereYear('transaction_date', now()->year)
                ->sum('amount'),
            
            'monthly_expenses' => Transaction::where('user_id', $user->id)
                ->where('type', 'expense')
                ->whereMonth('transaction_date', now()->month)
                ->whereYear('transaction_date', now()->year)
                ->sum('amount'),
            
            'transactions_count' => Transaction::where('user_id', $user->id)->count()
        ];

        $stats['current_balance'] = $stats['total_income'] - $stats['total_expenses'];

        return response()->json([
            'status' => 'success',
            'data' => $stats
        ]);
    }
}
*/