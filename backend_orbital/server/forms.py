from django import forms

from .models import *

class MemberUserForm(forms.ModelForm):
    class Meta:
        model = MemberUser
        fields = "__all__"
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['majorID'].queryset = Major.objects.none()
    
        '''
        if 'faculty' in self.data:
            try:
                facultyID = int(self.data.get('facultyID'))
                self.fields['majorID'].queryset = Major.objects.filter(facultyID=facultyID)
            except(ValueError, TypeError):
                pass

        elif self.instance.pk:
             self.fields['majorID'].queryset = self.instance.faculty.major_set.order_by('name')
        '''
       