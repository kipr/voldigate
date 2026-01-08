
import * as React from 'react';
import Dashboard from './pages/Dashboard';
import { connect } from 'react-redux';
import { State as ReduxState } from './state';
import { DARK, LIGHT, Theme } from './components/theme';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LocalizedString from './util/LocalizedString';
import { I18nAction } from './state/reducer';
export interface AppPublicProps {
  locale: LocalizedString.Language;
  setLocale: (locale: LocalizedString.Language) => void;
}

interface AppPrivateProps {

}

interface AppState {
  loading: boolean;
  storedTheme: Theme;
}

type Props = AppPrivateProps & AppPublicProps;
type State = AppState;

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      loading: true,
      storedTheme: localStorage.getItem('ideEditorDarkMode') === 'true' ? DARK : LIGHT
    };
  }
  componentDidMount() {
    /*
     * If the user has previously chosen a locale through the settings menu,
     * use it. Otherwise, guess based on their browser's langauge. To add
     * langauges, first review the Translation section in the README. Once
     * translated, if you wish to integrate your translations, you need to
     * LOCALE_OPTIONS in SettingsDialog.ts.
     */
    const lang: LocalizedString.Language = LocalizedString.validate(localStorage.getItem('bblocale'));
    if (lang) {
      this.props.setLocale(lang);
      console.log(`Read locale from localstorage: ${lang}`);
    } else {
      switch (navigator.language) {
        case 'ja':
          this.props.setLocale('ja-JP');
          break;
        case 'zh':
        case 'zh-CN':
          this.props.setLocale('zh-CN');
          break;
        case 'zh-HK':
        case 'zh-TW':
          this.props.setLocale('zh-TW');
          break;
        case 'es':
        case 'es-ES':
          this.props.setLocale('es-ES');
          break;
        case 'es-MX':
          this.props.setLocale('es-MX');
          break;
        case 'pt':
        case 'pt-PT':
          this.props.setLocale('pt-PT');
          break;
        case 'pt-BR':
          this.props.setLocale('pt-BR');
          break;
        case 'de':
          this.props.setLocale('de-DE');
          break;
        default:
          this.props.setLocale('en-US');
      }
    }
  }
  render() {

    return (
      <div style={{ maxHeight: '100vh', maxWidth: '100vw' }}>
        <Router>
          <Routes>
            <Route path="/" element={<Dashboard theme={this.state.storedTheme} locale={this.props.locale} />} />
          </Routes>
        </Router>
      </div>
    );
  }
}

export default connect(
  (state: ReduxState) => ({
    locale: state.i18n.locale,
  }),
  dispatch => ({
    setLocale: (locale: LocalizedString.Language) =>
      dispatch(I18nAction.setLocale({ locale })),
  })
)(App);

