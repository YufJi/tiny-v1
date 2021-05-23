import Nerv, { createNervClass } from '@/nerv';

import { createComponent } from '@/framework/';
import { getPropsEvent } from '@/utils/eventReg';
import Checkbox from '../shared/Checkbox';

export default createComponent({
  pure: false,
  name: 'checkbox',
})(createNervClass({
  displayName: 'Checkbox',
  // no formMixin, manage value by radio-group
  statics: {
    isFormControl: 1,
  },
  getDefaultProps: function getDefaultProps() {
    return {
      checked: false,
      disabled: false,
      value: '',
      controlled: false,
    };
  },

  getInitialState: function getInitialState() {
    const state = {
      checked: !!this.props.checked,
    };
    const { context } = this;
    const { checkboxGroup } = context;

    if (checkboxGroup) {
      checkboxGroup.updateValue(this.props.value, state.checked);
    }
    return state;
  },
  componentDidUpdate: function componentDidUpdate(prevProps) {
    const { context } = this;
    const { checkboxGroup } = context;

    if (checkboxGroup) {
      if (checkboxGroup.isResetting) {
        const value = checkboxGroup.state.value || [];
        this.setState({
          checked: value.indexOf(this.props.value) !== -1,
        });
        return;
      }
    }
    if (this.props.checked !== prevProps.checked) {
      this.setState({
        checked: this.props.checked,
      });
      if (checkboxGroup) {
        checkboxGroup.updateValue(this.props.value, this.props.checked);
      }
    }
  },
  componentWillUnmount() {
    const { checkboxGroup } = this.context;

    if (checkboxGroup) {
      let index1 = -1;
      if (checkboxGroup.initialValue) {
        index1 = checkboxGroup.initialValue.indexOf(this.props.value);
      }
      if (index1 !== -1) {
        checkboxGroup.initialValue.splice(index1, 1);
      }
      const index2 = checkboxGroup.state.value && checkboxGroup.state.value.indexOf(this.props.value);
      if (index2 !== -1 && checkboxGroup.state.value) {
        checkboxGroup.state.value.splice(index2, 1);
      }
    }
  },
  onClick() {
    if (!this.props.disabled) {
      this.onChange({ target: { checked: !this.state.checked } });
    }
  },
  onChange(e) {
    if (e.stopPropagation) {
      e.stopPropagation();
    }
    const { controlled } = this.props;
    const { checked } = e.target;

    if (!controlled) {
      this.setState({
        checked,
      });
    }
    const { context } = this;
    if (context.checkboxGroup) {
      e.detail = {
        value: checked,
        value2: this.props.value,
      };
      context.checkboxGroup.onChange(e);
    }

    // const event = this.props.$mp.getNormalizedEvent(e, {
    //   detail: {
    //     value: checked,
    //   },
    // });
    getPropsEvent.call(this, 'change')(e, {
      detail: {
        value: checked,
      },
    });
  },

  render() {
    const { disabled, className, style, id, controlled, color } = this.props;

    const checked = controlled ? this.props.checked : this.state.checked;

    return Nerv.createElement(Checkbox, {
      prefixCls: 'a-checkbox',
      className,
      id,
      style,
      checked,
      disabled,
      onChange: this.onChange,
      color,
    });
  },
}));
