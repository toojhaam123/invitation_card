<?php

namespace App\Http\Requests;

// use Dotenv\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class InvitationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Bắt buộc phải là số và tồn tại trong bảng users 
            'user_id' => 'required|exists:users,id',
            // Bắt buộc, không được trùng trong bảng invitations
            'slug' => 'required|string|unique:invitations,slug|max:255',

            'guest_name'     => 'nullable|string|max:255',
            'groom_name'     => 'required|string|max:255',
            'bride_name'     => 'required|string|max:255',
            'phone_contacts' => 'nullable|string|max:20',

            // Thời gian phải đúng định dạng date (Y-m-d H:i:s)
            'event_date'     => 'required|date',
            'lunar_date'     => 'nullable|string|max:255',

            // Chỉ chấp nhận 1 trong 3 giá trị này
            'location_type'  => 'required|in:nhà trai,nhà gái,nhà hàng',

            'address'        => 'required|string|max:500',
            'map_iframe'     => 'nullable|string',

            // Kiểm tra file ảnh (nếu bạn gửi file trực tiếp) hoặc string (nếu gửi link)
            'cover_image'    => 'nullable|string',
            'album_image'    => 'nullable|array', // Vì mình cast nó là array trong Model

            'music_url'      => 'nullable|url',
            'qr_code_bank'   => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'user_id.exists'      => 'Người dùng không tồn tại.',
            'slug.unique'         => 'Đường dẫn (slug) này đã được sử dụng, vui lòng chọn cái khác.',
            'groom_name.required' => 'Vui lòng nhập tên chú rể.',
            'bride_name.required' => 'Vui lòng nhập tên cô dâu.',
            'event_date.required' => 'Ngày tổ chức tiệc là bắt buộc.',
            'event_date.date'     => 'Định dạng ngày tháng không hợp lệ.',
            'location_type.in'    => 'Loại địa điểm phải là: nhà trai, nhà gái hoặc nhà hàng.',
            'address.required'    => 'Vui lòng nhập địa chỉ tổ chức.',
        ];
    }

    protected function failedValidation(Validator $validator)
    {

        throw new HttpResponseException(response()->json([
            'success'   => false,
            'message'   => 'Dữ liệu không hợp lệ',
            'errors'    => $validator->errors()
        ], 422));
    }
}
