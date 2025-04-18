# MOISO

팀 및 프로젝트 관리, 일정 조정, 업무 관리 기능을 제공하는 업무 관리 웹 서비스.

## 개발 스택

백엔드: Django REST Framework(DRF)
프론트엔드: Next.js

## 기능 상세

### 메인 페이지

사이드 바를 통해 팀 스페이스를 설정하고 팀과 프로젝트 페이지로 바로가기할 수 있다.

### 캘린더

하루 일정을 확인할 수 있다.

![image](https://github.com/user-attachments/assets/eac76107-75f9-4904-b0a2-6d4fe375e479)


한달 일정을 확인할 수 있다.
프로젝트를 선택하여 특정 프로젝트의 일정만 따로 확인할 수 있다.

![image](https://github.com/user-attachments/assets/7274d486-5bb6-40c3-85a3-d09c04faef02)

### 팀 페이지

#### 프로젝트 목록

프로젝트 목록을 확인할 수 있다.

![image](https://github.com/user-attachments/assets/72d3b09f-142c-4e9b-b054-7b8e31c6192d)

프로젝트를 클릭하여 상세 정보를 확인할 수 있다. 
프로젝트를 삭제하거나 이름, 설명, 진행 상태, 시작 일자, 종료 일자 등의 정보를 수정할 수 있다.

![image](https://github.com/user-attachments/assets/d797f633-1502-415e-841c-f7320d8a5e27)
<img width="1470" alt="image" src="https://github.com/user-attachments/assets/f03f6abc-7d07-43c8-a1e4-b9b23f2b5cec" />


카테고리를 새롭게 추가할 수 있다.

![image](https://github.com/user-attachments/assets/dbb65b2e-ab30-438d-82dd-a3abac169d22)

프로젝트에 참여 중인 멤버를 확인할 수 있으며 멤버를 추가하거나 제외할 수 있다.

![image](https://github.com/user-attachments/assets/409bb125-4fdc-4a76-bb12-9300cb77e310)

#### 일정 목록

팀 일정을 확인할 수 있다.

![image](https://github.com/user-attachments/assets/0e1e597d-f955-41c2-8334-3d2cd0c98b6e)


#### 멤버 목록

팀에 참여중인 멤버를 확인할 수 있다.

![image](https://github.com/user-attachments/assets/80654b68-e376-45fe-9916-88d74229bc7d)

각 멤버에게 부여된 역할과 권한을 확인할 수 있다.

![image](https://github.com/user-attachments/assets/ad35a1ca-c826-46d0-87a0-7975dd17b285)

관리 권한이 있는 경우 멤버의 역할을 수정할 수 있다.

![image](https://github.com/user-attachments/assets/65ca6c13-55de-4e0f-8700-b2b13db25bca)



### 프로젝트 패이지

#### 업무 목록

업무 목록을 확인할 수 있다.

![image](https://github.com/user-attachments/assets/5ac3cf17-73ab-464a-8af7-8ad11d798f9b)

업무를 클릭하면 상제 정보를 확인할 수 있다.

![image](https://github.com/user-attachments/assets/54ab7654-ffaf-4740-9b5a-eeaa621f77fd)

담당자를 추가하거나 삭제할 수 있다.

![image](https://github.com/user-attachments/assets/3ea43db7-f0c9-4180-8f82-de78a16552a1)


#### 멤버 목록

프로젝트에 참여 중인 멤버 목록과 권한을 확인할 수 있다.

![image](https://github.com/user-attachments/assets/9388b20c-8b15-4e44-9cd9-f545e241112e)


### 프로젝트 초대

이메일로 새로운 멤버를 초대할 수 있다.

![image](https://github.com/user-attachments/assets/b44b89da-58ab-4503-b44f-3e7f4a385270)

토큰이 있는 회원가입 링크가 메일로 전송된다. 해당 링크로 접속할 경우 토큰 유효성 검증과 이메일 검증을 통해 해당 프로젝트에 가입할 수 있다.

![image](https://github.com/user-attachments/assets/9e724d0b-f40e-41e6-94c3-1ee46cb9ca9f)


### 프로필

#### 업무 목록

내 업무를 확인할 수 있다. 진행 상태에 따라 업무를 필터링할 수 있다.

![image](https://github.com/user-attachments/assets/5b67362f-dfbd-4ca1-84d9-1341ed31e018)

