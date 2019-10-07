import GoogleWrapper from './GoogleWrapper';
import CommonProcessor from './CommonProcessor';
import simpleProcessorFactory, { NameSheetData } from './simpleProcessorFactory';

const onboardingProcessorFactory = (wrapper: GoogleWrapper): CommonProcessor<NameSheetData> => {
  let processor = simpleProcessorFactory(wrapper);
  const onboardedEmployees: int[] = [];

  processor.sync = new Proxy(processor.sync, {
    apply: (target, targetThis, applyArguments) => (
      Reflect.apply(target, targetThis, applyArguments)
    ),
  });

  processor = new Proxy(processor, {
    get: (target: CommonProcessor<NameSheetData>, targetProperty, reciever) => {
      if (targetProperty === 'onboardedEmployees') {
        return onboardedEmployees;
      }

      return Reflect.get(target, targetProperty, reciever);
    },
  });

  return processor;
};

export default onboardingProcessorFactory;
