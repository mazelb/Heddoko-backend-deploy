var i18n = i18n||{};
i18n.Resources = (function () { 
	var strings = {
  "AnatomicalPositionType_LeftForeArm": "Left Fore Arm",
  "AnatomicalPositionType_LeftThigh": "Left Thigh",
  "AnatomicalPositionType_LeftTibia": "Left Tibia",
  "AnatomicalPositionType_LeftUpperArm": "Left Upper Arm",
  "AnatomicalPositionType_RightForeArm": "Right Fore Arm",
  "AnatomicalPositionType_RightThigh": "Right Thigh",
  "AnatomicalPositionType_RightTibia": "Right Tibia",
  "AnatomicalPositionType_RightUpperArm": "Right Upper Arm",
  "AnatomicalPositionType_UpperSpine": "Upper Spine",
  "ConditionType_New": "New",
  "ConditionType_Used": "Used",
  "Confirmed": "Confirmed",
  "ConfirmPassword": "Confirm password",
  "ConfirmPasswordValidateMessage": "The passwords do not match",
  "ConfirmToken": "Confirm token",
  "CreateNewAccount": "Create a new account",
  "Email": "Email",
  "EmailActivatedBody": "You have been activated",
  "EmailActivatedSubject": "Activated!",
  "EmailActivationUserSubject": "Welcome!",
  "EmailForgotPasswordSubject": "Forgot password",
  "EmailForgotUsernameSubject": "Remind username",
  "EmptyConfirmationToken": "Empty confirmation token",
  "EmptyForgotToken": "Empty forgot token",
  "EquipmentStatusType_Available": "Available",
  "EquipmentStatusType_InTransit": "In transit",
  "EquipmentStatusType_OnLoan": "On loan",
  "EquipmentStatusType_Unavailable": "Unavailable",
  "ExpiredForgotToken": "Forgot token is expired",
  "ForgotYourPassword": "Forgot your password?",
  "ForgotYourUsername": "Forgot your username?",
  "HeatsShrinkType_No": "No",
  "HeatsShrinkType_Yes": "Yes",
  "Heddoko": "Heddoko",
  "Login": "Login",
  "MaterialType_Battery": "Battery",
  "MaterialType_Sensor": "Sensor",
  "MovementEventType_Jump": "Jump",
  "MovementEventType_Standing": "Standing",
  "NewPassword": "New password",
  "NumbersType_No": "No",
  "NumbersType_Yes": "Yes",
  "Password": "Password",
  "PasswordSuccessufullyChanged": "Password Successfully Changed",
  "PrototypeType_No": "No",
  "PrototypeType_Yes": "Yes",
  "ShipType_Gone": "Gone",
  "ShipType_No": "No",
  "ShipType_Yes": "Yes",
  "SignInInspiring": "More Than Just a Coach",
  "Title": "Heddoko | Track your movement in 3D",
  "UserGenderType_Female": "Female",
  "UserGenderType_Male": "Male",
  "UserGenderType_NotSpecified": "NotSpecified",
  "UserIsBanned": "User is banned",
  "Username": "Username",
  "UserRoleType_Admin": "Admin",
  "UserRoleType_Analyst": "Analyst",
  "UserRoleType_User": "User",
  "UserStatusType_Active": "Active",
  "UserStatusType_Banned": "Banned",
  "UserStatusType_NotActive": "Inactive",
  "ValidateEmailMessage": "The E-mail field is not a valid e-mail address",
  "ValidateLengthMessage": "The {0} must be at least {2} characters long.",
  "ValidateLengthRangeMessage": "The {0} must be from {2} to {1} characters long",
  "ValidateMaxLengthMessage": "The {0} cannot be longer than {2} characters long.",
  "ValidateRequiredMessage": "The {0} field is required",
  "WrongConfirmationToken": "Wrong confirmation token",
  "WrongEmailForgotPassword": "No account found with that email address",
  "WrongForgotToken": "Invalid forgot token",
  "WrongUsernameOrPassword": "These credentials do not match our records.",
  "YouAreNotAllowed": "You are not allowed",
  "YouAreNotAuthorized": "You are not authorized",
  "Oops": "<strong>Whoops!</strong> There were some problems with your input.<br><br>",
  "PasswordForgotMessage": "Enter the email address that you used to register. We'll send you an email with your username and a link to reset your password.",
  "ResetPassword": "Reset password",
  "RetrieveUsername": "Retrieve Username",
  "UsernameForgotMessage": "Enter the email address that you used to register. We'll send you an email with your username.",
  "AccountType": "Account Type",
  "Birthday": "Date of Birth",
  "Confirm": "Confirm",
  "ConfirmMessage": "Use this form to confirm your account",
  "Country": "Country",
  "EmailAddress": "Email Address",
  "Firstname": "First Name",
  "Lastname": "Last Name",
  "Mobile": "Mobile",
  "PasswordSuccessufullySent": "We have sent an email with a link to reset a password",
  "ResetPasswordMessage": "Use this form to reset your password.",
  "UsernameSuccessufullySent": "We have sent an email with your username.",
  "EmailUsed": "Email already used",
  "UsernameUsed": "Username already used",
  "UserSignupMessage": "User have been created. We have sent email with activation link, please activate your account.",
  "And": "and",
  "Privacy": "privacy policy",
  "SignInInviteMessage": "Already have an account?",
  "SignInMessage": "Log in now",
  "SignUp": "Sign up",
  "TermMessage": "By clicking on Sign up, you agree to <br> our",
  "Terms": "terms & conditions",
  "UserIsNotActive": "User is not activated",
  "Actions": "Actions",
  "AdminTitle": "Heddoko Inventory v0.4",
  "Dashboard": "Dashboard",
  "Delete": "Delete",
  "Edit": "Edit",
  "EmptyItems": "No item to display",
  "ID": "ID",
  "Identifier": "Identifier",
  "SignOut": "SignOut",
  "WrongObjectAccess": "You don't access to that object",
  "AddANew": "Add a new",
  "AnatomicalPosition": "Anatomical position",
  "AnatomicalPositions": "Anatomical positions",
  "Equipment": "Equipment",
  "Equipments": "Equipments",
  "Error": "Error",
  "Find": "Find",
  "Home": "Home",
  "Information": "Information",
  "LicenseTitle": "License dashboard",
  "Material": "Material",
  "Materials": "Materials",
  "MaterialType": "Material type",
  "Reset": "Reset",
  "Search": "Search",
  "Submit": "Submit",
  "Suit": "Suit",
  "Suits": "Suits",
  "Warning": "Warning",
  "MaterialTypes": "Material Types",
  "CannotAddDuplicate": "Can't add duplicate",
  "EnterIdentifier": "Enter an identifier",
  "EnterMaterial": "Enter the name or part # of a material",
  "Name": "Name",
  "PartNo": "Part #",
  "CannotRemove": "Can't delete, because",
  "Use": "use",
  "EnterEquipment": "Enter the serial # or location or mac address of an equipment",
  "Notes": "Notes",
  "Condition": "Condition",
  "HeatsShrink": "Heats shrink",
  "MacAddress": "MAC Address",
  "Numbers": "Numbers",
  "PhysicalLocation": "Physical location",
  "Prototype": "Prototype",
  "SelectAnatomicalPosition": "Select an anatomical position",
  "SelectCondition": "Select a condition",
  "SelectHeatsShrink": "Select a heats shrink",
  "SelectMaterial": "Select a material",
  "SelectMaterialType": "Select a material type",
  "SelectNumber": "Select a number",
  "SelectPrototype": "Select a prototype",
  "SelectShip": "Select a ready ship",
  "SelectStatus": "Select a status",
  "SelectVerifiedBy": "Select verified by",
  "SerialNo": "Serial #",
  "Ship": "Ship",
  "Status": "Status",
  "UserRoleType_LicenseAdmin": "License manager",
  "VerifiedBy": "Verified by"
};
	return $.extend({}, i18n.Resources || {}, strings);
}());