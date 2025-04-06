import config from "../config";

// Icons
import "./assets/vendor/fonts/materialdesignicons.css";
import "./assets/vendor/fonts/fontawesome.css";
import "./assets/vendor/fonts/flag-icons.css";

import "./assets/vendor/libs/dropzone/dropzone.css";

// Menu waves for no-customizer fix
import "./assets/vendor/libs/node-waves/node-waves.css";

// Core CSS
import "./assets/vendor/css/rtl/core.css";
import "./assets/vendor/css/rtl/theme-default.css";
import "./assets/css/demo.css";

// Vendors CSS
import "./assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css";
import "./assets/vendor/libs/typeahead-js/typeahead.css";

import "./assets/vendor/libs/form-validation/umd/styles/index.min.css";
import "./assets/vendor/css/pages/page-profile.css";
import "./assets/vendor/css/pages/page-auth.css";
import { Helmet } from "react-helmet";

const Css = () => {
  return (
    <>
      <Helmet>
        {/* <script src="./assets/vendor/js/helpers.js"></script> */}
        {/* <script  src="./assets/vendor/js/template-customizer.js"></script> */}
        <script src={`/assets/js/config.js?v=${config.v}`}></script>
      </Helmet>
    </>
  );
};

export default Css;
