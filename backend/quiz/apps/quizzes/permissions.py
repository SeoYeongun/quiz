from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsOwnerOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        # 조회는 모두 허용
        if request.method in SAFE_METHODS:
            return True

        # 작성자만 수정/삭제 허용
        return obj.user == request.user