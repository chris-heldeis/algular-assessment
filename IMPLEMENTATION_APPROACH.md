## Implementation Approach of Assessment Tasks

1. **Refactor folder structure**
   - Grouped files into pages, components, models and services folders for cleaner structure.
   - Created model files by taking model interfaces out from service files.
   - Used angular alias to simplify referring files.

2. **User-friendly solution of task1**
   - Introduced workspace dropdown to select a workspace instead of using hardcoded workspace ID for better user experience. (By default, only one workspace has got messages, so switching workspace is necessary to check actions of case when there is no result.)
   - Show "No result" messages when there is no data to display.
   - Show error messages by toast type.
   - Show pagination to simulate real usage.
   - Added force sleeping 2 seconds to simulate real case of API calling.

3. **User-friendly solution of task2**
   - All workspaces are loaded in dropdown by default and introduced two buttons to switch panels for creating workspace and sending message.
   - When create new workspace, if succeed, created one is added to dropdown and selected automatically.
   - Workspace is required to send message. If there is no workspace, cannot go to sending message panel and will get notification about it.
   - All forms are validated when form is submitted. Form validation errors are shown in each form field.
   - All success or failure results are notified by toast-like notifications.

4. **Clean code**
   - All elements were written under modern angular coding convention.
   - Rich comments for functions and definitions.