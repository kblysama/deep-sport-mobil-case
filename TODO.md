# TODO: Fix Skeleton and Screenshot Issues

## Tasks
- [ ] Change pose model to 'lite' in pose.service.ts for better mobile performance
- [ ] Adjust camera resize dimensions to 256x256 in CustomTensorCamera.tsx for standard pose input
- [ ] Update CAM_WIDTH and CAM_HEIGHT constants in MainScreen.tsx to match new dimensions
- [ ] Add more debugging logs to track pose detection and screenshot attempts
- [ ] Verify screenshot ref handling in CustomTensorCamera.tsx
- [ ] Test the changes on device

## Notes
- Current model is 'full' which may be too heavy for mobile
- Resize dimensions were 360x640, changing to 256x256 for better pose detection
- Ensure ref forwarding works for takePictureAsync in TensorCamera
