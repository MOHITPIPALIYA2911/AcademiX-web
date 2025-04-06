import { Helmet } from "react-helmet";
import config from "../config";
function Script() {
  return (
    <>
      <Helmet>
        <script src={`/assets/vendor/libs/jquery/jquery.js?v=${config.v}`}></script>
        <script src={`/assets/vendor/libs/popper/popper.js?v=${config.v}`}></script>
        <script src={`/assets/vendor/js/bootstrap.js?v=${config.v}`}></script>

        <script src={`/assets/vendor/libs/node-waves/node-waves.js?v=${config.v}`}></script>
        <script src={`/assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.js?v=${config.v}`}></script>
        <script src={`/assets/vendor/libs/hammer/hammer.js?v=${config.v}`}></script>

        <script src={`/assets/vendor/libs/i18n/i18n.js?v=${config.v}`}></script>

        {/* <script src="/assets/vendor/libs/typeahead-js/typeahead.js"></script> */}
        {/* <script src="/assets/vendor/libs/dropzone/dropzone.js"></script> */}
        {/* <script src="/assets/vendor/js/menu.js"></script> */}

        <script src={`/assets/js/main.js?v=${config.v}`}></script>
      </Helmet>
    </>
  );
}

export default Script;
