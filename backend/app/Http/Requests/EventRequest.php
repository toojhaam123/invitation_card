<?php

namespace App\Http\Requests;

// use Dotenv\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class EventRequest extends FormRequest
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
        $isCoverFile = $this->hasFile('cover_image');
        $isQRFile = $this->hasFile('qr_code_bank');
        return [
            // Bắt buộc, không được trùng trong bảng invitations
            'slug' => 'string|unique:wedding_events,slug|max:255',

            'groom_name'     => 'required|string|max:255',
            'bride_name'     => 'required|string|max:255',
            'phone_contacts' => 'nullable|string|max:20',

            // Bên trai 
            'groom_father' => 'required|string|max:255',
            'groom_mother' => 'required|string|max:255',

            // Bên gái
            'bride_father' => 'required|string|max:255',
            'bride_mother' => 'required|string|max:255',

            // Thời gian phải đúng định dạng date (Y-m-d H:i:s)
            'event_date'     => 'required|date',
            'lunar_date'     => 'nullable|string|max:255',

            // Chỉ chấp nhận 1 trong 3 giá trị này
            'location_type'  => 'required|in:nhà trai,nhà gái,nhà hàng',

            'address'        => 'required|string|max:500',
            'map_iframe'     => 'nullable|string',

            // Kiểm tra file ảnh (nếu bạn gửi file trực tiếp) hoặc string (nếu gửi link)
            'cover_image'    => $isCoverFile ? 'nullable|image|mimes:jpg,png,gif|max:5120' : 'nullable|string',
            'qr_code_bank'   => $isQRFile ? 'nullable|image|mimes:jpg,png,gift|max:5120' : 'nullable|string',
            'album_image'   => 'nullable|array',
            'album_image.*' => [
                'nullable',
                function ($attribute, $value, $fail) {
                    // 1. Nếu là chuỗi (tên file cũ), cho qua luôn
                    if (is_string($value)) {
                        return;
                    }

                    // 2. Nếu là File, mới bắt đầu kiểm tra định dạng
                    if ($value instanceof \Illuminate\Http\UploadedFile) {
                        $extension = strtolower($value->getClientOriginalExtension());
                        if (!in_array($extension, ['jpg', 'jpeg', 'png', 'gif'])) {
                            $fail('Ảnh trong album phải có định dạng: jpg, jpeg, png, gif.');
                        }
                        if ($value->getSize() > 5120 * 1024) {
                            $fail('Ảnh không được vượt quá 5MB.');
                        }
                    } else {
                        // 3. Nếu không phải string cũng không phải file (ví dụ null hoặc object lạ)
                        $fail('Dữ liệu ảnh không hợp lệ.');
                    }
                },
            ],
        ];
    }

    public function messages(): array
    {
        return [
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
