// import AsyncStorage from "@react-native-async-storage/async-storage";
// import useStorage from "../../src/hooks/useStorage";
// import { act, renderHook, waitFor } from '@testing-library/react';

// jest.mock('@react-native-async-storage/async-storage');

// describe("스토리지_CRD_테스트", () => {
//   const key = 'test-key';
//   const defaultValue = "default";

//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   test("초기_렌더링_시_AsyncStorage에서_값을_가져온다.", async () => {
//     (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('"saved-value"');

//     const { result } = renderHook(() => useStorage<string>(key, defaultValue));

//     // (1) 초기 effect로 AsyncStorage에서 '"saved-value"'가져올 때까지 대기
//     await waitFor(() => {
//       expect(result.current[0]).toBe("saved-value");
//     });
    
//     // 이제 result.current[0] === 'saved-value'
//     expect(AsyncStorage.getItem).toHaveBeenCalledWith(key);
//   });

//   test("setValue를_호출하면_AsyncStorage에_저장되고_상태가_바뀐다.", async () => {
//     (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

//     const { result } = renderHook(() => useStorage<string>(key, defaultValue));

//     await waitFor(() => {
//       expect(result.current[0]).toBe(null);
//     });

//     await act(async () => {
//       await result.current[1]("new-value");
//     });

//     // 이제 setValue 적용 확인
//     await waitFor(() => {
//       expect(AsyncStorage.setItem).toHaveBeenCalledWith(key, JSON.stringify("new-value"));
//       expect(result.current[0]).toBe("new-value");
//     });
//   });

//   test("removeValue를_호출하면_AsyncStorage에서_삭제되고_상태가_null이_된다.", async () => {
//     (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('"saved-value"');

//     const { result } = renderHook(() => useStorage<string>(key, defaultValue));

//     await waitFor(() => {
//       expect(result.current[0]).toBe("saved-value");
//     });

//     await act(async () => {
//       await result.current[2]();
//     });

//     await waitFor(() => {
//       expect(AsyncStorage.removeItem).toHaveBeenCalledWith(key);
//       expect(result.current[0]).toBe(null);
//     });
//   });
// });