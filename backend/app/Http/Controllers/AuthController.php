<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\CssSelector\Node\FunctionNode;

class AuthController extends Controller
{
    // Đăng ký tài khoản mới
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:users,name',
            'email' => 'required|email|string|max:255|unique:users,email',
            'password' => 'required|string|min:6'
        ], [
            'name.unique' => "Tên người dùng đã tồn tại!",
            'email.unique' => "Email đã tông tại!",
            'password.min' => "Mật khẩu ít nhất 6 ký tự!",

        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        return response()->json([
            'success' => true,
            'message' => "Đăng ký tài khoản thành công!",
        ], 201);
    }

    // Hàm login người dùng 
    public function login(Request $request)
    {
        // Bảo mật validate 
        $fields = $request->validate([
            'email' => 'required|string|email|',
            'password' => 'required|string',
        ]);

        // Kiểm tra email có tồn tại hay không 
        $user = User::where('email', $fields['email'])->first();

        // Kiểm tra mật khẩu
        if (!$user || !Hash::check($fields['password'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => "Thông tin đăng nhập không chính xác!",
            ], 401);
        }

        // Tạo token mới 
        $token = $user->createToken('token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => "Đã đăng nhập thành công!",
            'token' => $token,
            'token_type' => 'Bearer',
            "user" => $user,
        ], 200);
    }

    // Hàm logout 
    public function logout(Request $request)
    {
        // Chỉ xóa token của chính yêu cầu hiện tại 
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Đã đăng xuất!',
        ]);
    }
}
