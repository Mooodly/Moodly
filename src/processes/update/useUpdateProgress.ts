import { useEffect, useState } from 'react';
import { useAppSelector } from '../../shared/hooks';

export function useUpdateProgress() {
  const progress = useAppSelector(state => state.progressSlice.progress);
  const [step, setStep] = useState('업데이트 내용을 확인하고 있습니다.');

  useEffect(() => {
    if (progress === 0) {
      setStep('업데이트 내용을 확인하고 있습니다.');
    } else if (progress < 20) {
      setStep('다운로드 중...');
    } else if (progress < 40) {
      setStep('데이터 처리 중...');
    } else if (progress < 60) {
      setStep('설정 적용 중...');
    } else if (progress < 80) {
      setStep('마무리 작업 중...');
    } else if (progress < 100) {
      setStep('완료 준비 중...');
    } else {
      setStep('업데이트 완료!');
    }
  }, [progress]);

  return {
    step,
    progress
  };
}
