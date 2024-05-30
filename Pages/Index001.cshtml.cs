using System.Data;
using System.Security.Cryptography;
using Elsa.ServerAndStudio.Web.Extensions;
using Elsa.Workflows.Contracts;
using Elsa.Workflows.Management.Contracts;
using Elsa.Workflows.Management.Mappers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Data.SqlClient;
using Newtonsoft.Json;

namespace Elsa.ServerAndStudio.Web.Pages
{
    public class Index001Model : PageModel
    {
        private readonly IWorkflowDefinitionStore _store;
        private readonly IApiSerializer _apiSerializer;
        private readonly WorkflowDefinitionMapper _mapper;
        private IConfiguration _fxConfigurationManager;
        //private ILogger _fxLogger;
        public Index001Model(IConfiguration fxConfigurationManager, IWorkflowDefinitionStore store, IApiSerializer apiSerializer, WorkflowDefinitionMapper mapper)
        {
            _store = store;
            _apiSerializer = apiSerializer;
            _mapper = mapper;
            this._fxConfigurationManager = fxConfigurationManager;
            //this._fxLogger = fxLogger;
            FxDBUtility.fxConfigurationManager = this._fxConfigurationManager;
            FxDBUtility.fxDBConnectionString = this._fxConfigurationManager.GetConnectionString("FxDBConn4Biz");
            //FxDBUtility.fxLogger = this._fxLogger;
        }
        public void OnGet()
        {
        }
        public async Task<IActionResult> OnGetNewID(string fxDefinitionId, string fxVersionOptions)
        {
            var bytes = new byte[8];
            RandomNumberGenerator.Fill(bytes);
            var randomLong = BitConverter.ToInt64(bytes, 0);
            string id = randomLong.ToString("x");
            return new JsonResult(new { id = id });
        }
        public async Task<IActionResult> OnGetFxLoadWFSchemeEntities(string workflowDefinitionId, string sheetID)
        {
            //psp 20201003,web执行工作流的时候记录AppDomain
            //string fxWebAppName = _fxApplication.FxConfigurationManager.FxAppSettings()["FxWebAppName"];
            //ADD WFSchemeEntity
            string sqlSelect = @"SELECT * FROM fxprj30wf.WFSchemeEntity WHERE EntityPKValue='" + sheetID + "' AND WFSchemeID='" + workflowDefinitionId + "' ORDER BY CreateDate DESC";
            //SqlCommand cmdSelect = new SqlCommand(sqlSelect);
            //cmdSelect.Parameters.AddWithValue("@EntityPKValue", sheetID);
            //cmdSelect.Parameters.AddWithValue("@WFSchemeID", workflowDefinitionId);
            DataTable dt = new DataTable();
            try
            {
                dt = FxDBUtility.LoadData(sqlSelect);
            }
            catch (Exception ex)
            {
                //_fxLogger.LogError(ex.Message, ex);
            }
            string jsonString = JsonConvert.SerializeObject(dt, Formatting.Indented);
            return Content(jsonString);
        }
        public async Task<IActionResult> OnGetFxLoadWorkflowPermissionByDefinitionId(string workflowDefinitionId, string userGuid)
        {
            //psp 20201003,web执行工作流的时候记录AppDomain
            //string fxWebAppName = _fxApplication.FxConfigurationManager.FxAppSettings()["FxWebAppName"];
            //ADD WFSchemeEntity
            string sqlSelect = $"SELECT fxprj30wf.WFTransitionSchemePermission.WFTransitionSchemeID FROM fxprj30wf.WFTransitionScheme,fxprj30wf.WFTransitionSchemePermission WHERE " +
                $"fxprj30wf.WFTransitionScheme.WFTransitionSchemeID=fxprj30wf.WFTransitionSchemePermission.WFTransitionSchemeID AND " +
                $"fxprj30wf.WFTransitionSchemePermission.UserGuid='{userGuid}' AND " +
                $"ISNULL(fxprj30wf.WFTransitionSchemePermission.FlagDelete,0)<=0 AND " +
                $"fxprj30wf.WFTransitionScheme.WFSchemeID='" + workflowDefinitionId + "'";
            //SqlCommand cmdSelect = new SqlCommand(sqlSelect);
            //cmdSelect.Parameters.AddWithValue("@EntityPKValue", sheetID);
            //cmdSelect.Parameters.AddWithValue("@WFSchemeID", workflowDefinitionId);
            DataTable dt = new DataTable();
            List<string> permissions = new List<string>();
            try
            {
                dt = FxDBUtility.LoadData(sqlSelect);
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    permissions.Add(FxDBUtility.GetFieldValue(dt, 0, 0));
                }
            }
            catch (Exception ex)
            {
                //_fxLogger.LogError(ex.Message, ex);
            }
            string jsonString = JsonConvert.SerializeObject(permissions, Formatting.Indented);
            return Content(jsonString);
        }
        //https://localhost:5001/Index001?handler=Test001&cityTerm=shanghai
        public async Task<IActionResult> OnGetFxWrite2DB4WFScheme(
                string WFSchemeID
                , string WorkFlowName
                , string GroupName
                , string AssemblyName
                , string TypeName
                , string Status
                , int? CurrVersion
                , int? FlagDelete
                , string AppModuleID
                , string Description
                , int? SortID
                , DateTime? CreateDate
                , string CreateUserID
                , DateTime? UpdateDate
                , string UpdateUserID)
        {
            string cmdText4Delete = @"DELETE FROM fxprj30wf.WFScheme WHERE WFSchemeID=@WFSchemeID";
            SqlCommand cmd4Delete = new SqlCommand(cmdText4Delete);
            cmd4Delete.Parameters.AddWithValue("@WFSchemeID", WFSchemeID);
            string cmdText4Insert = @"
            INSERT INTO fxprj30wf.WFScheme
            (WFSchemeID
            ,WorkFlowName
            ,GroupName
            ,AssemblyName
            ,TypeName
            ,Status
            ,CurrVersion
            ,FlagDelete
            ,AppModuleID
            ,Description
            ,SortID
            ,CreateDate
            ,CreateUserID
            ,UpdateDate
            ,UpdateUserID)
            VALUES
            (@WFSchemeID
            ,@WorkFlowName
            ,@GroupName
            ,@AssemblyName
            ,@TypeName
            ,@Status
            ,@CurrVersion
            ,@FlagDelete
            ,@AppModuleID
            ,@Description
            ,@SortID
            ,@CreateDate
            ,@CreateUserID
            ,@UpdateDate
            ,@UpdateUserID)";
            SqlCommand cmd4Insert = new SqlCommand(cmdText4Insert);
            cmd4Insert.Parameters.AddWithValue("@WFSchemeID", WFSchemeID ?? "");
            cmd4Insert.Parameters.AddWithValue("@WorkFlowName", WorkFlowName ?? "");
            cmd4Insert.Parameters.AddWithValue("@GroupName", GroupName ?? "");
            cmd4Insert.Parameters.AddWithValue("@AssemblyName", AssemblyName ?? "");
            cmd4Insert.Parameters.AddWithValue("@TypeName", TypeName ?? "");
            cmd4Insert.Parameters.AddWithValue("@Status", Status ?? "");
            cmd4Insert.Parameters.AddWithValue("@CurrVersion", CurrVersion ?? 0);
            cmd4Insert.Parameters.AddWithValue("@FlagDelete", FlagDelete ?? 0);
            cmd4Insert.Parameters.AddWithValue("@AppModuleID", AppModuleID ?? "");
            cmd4Insert.Parameters.AddWithValue("@Description", Description ?? "");
            cmd4Insert.Parameters.AddWithValue("@SortID", SortID ?? 0);
            cmd4Insert.Parameters.AddWithValue("@CreateDate", CreateDate ?? DateTime.Now);
            cmd4Insert.Parameters.AddWithValue("@CreateUserID", CreateUserID ?? "System");
            cmd4Insert.Parameters.AddWithValue("@UpdateDate", UpdateDate ?? DateTime.Now);
            cmd4Insert.Parameters.AddWithValue("@UpdateUserID", UpdateUserID ?? "System");
            int iresult = FxDBUtility.ExecuteNonQuery(new SqlCommand[] { cmd4Delete, cmd4Insert });
            JsonResult jr = new JsonResult(new { token = DateTime.Now });
            //jr.MaxJsonLength = Int32.MaxValue;
            return jr;
        }
        public async Task<IActionResult> OnGetFxWrite2DB4WFTransitionScheme(
               string WFTransitionSchemeID
              , string WFSchemeID
              , string TransitionName
              , string OpName
              , string BookMarkName
              , string WFScreenAssemblyName
              , string WFScreenTypeName
              , string WFInputScreenAssemblyName
              , string WFInputScreenTypeName
              , string WFValidatorAssemblyName
              , string WFValidatorTypeName
              , int? CheckPermission
              , string WFInputScreenBtnsInJSON
              , string FromStatusID
              , string ToStatusID
              , string WFScreenID
              , string RelationID
              , string RelationText
              , int? FlagDelete
              , int? EnableBack
              , int? SortID
              , string DWObject4ExecuteValidate
              , string DWObject4BackValidate
              , string DWObject4Mail
              , string DWObject4Task
              , string SPAfterExecute
              , string CreateUserID
              , DateTime? CreateDate
              , string UpdateUserID
              , DateTime? UpdateDate
              , string NextWFSchemeIDS
              , string WFExecutorScreenid
              , string SendWFTskTo
              , string WFTaskUserRule
              , string Sql4EntityLoad
              , string Xslt4TaskUrl
              , string Xslt4TaskDescription
              , string Xslt4Mail
              , string Xslt4Message
              , string Xslt4TaskRelationID
              , string EntityViewName
              , int? HideIfNoPermission)
        {
            string cmdText4Delete = @"DELETE FROM fxprj30wf.WFTransitionScheme WHERE WFTransitionSchemeID=@WFTransitionSchemeID";
            SqlCommand cmd4Delete = new SqlCommand(cmdText4Delete);
            cmd4Delete.Parameters.AddWithValue("@WFTransitionSchemeID", WFTransitionSchemeID ?? "");
            string cmdText4Insert = @"
            INSERT INTO fxprj30wf.WFTransitionScheme
            (WFTransitionSchemeID
            ,WFSchemeID
            ,TransitionName
            ,OpName
            ,BookMarkName
            ,WFScreenAssemblyName
            ,WFScreenTypeName
            ,WFInputScreenAssemblyName
            ,WFInputScreenTypeName
            ,WFValidatorAssemblyName
            ,WFValidatorTypeName
            ,CheckPermission
            ,WFInputScreenBtnsInJSON
            ,FromStatusID
            ,ToStatusID
            ,WFScreenID
            ,RelationID
            ,RelationText
            ,FlagDelete
            ,EnableBack
            ,SortID
            ,DWObject4ExecuteValidate
            ,DWObject4BackValidate
            ,DWObject4Mail
            ,DWObject4Task
            ,SPAfterExecute
            ,CreateUserID
            ,CreateDate
            ,UpdateUserID
            ,UpdateDate
            ,NextWFSchemeIDS
            ,WFExecutorScreenid
            ,SendWFTskTo
            ,WFTaskUserRule
            ,Sql4EntityLoad
            ,Xslt4TaskUrl
            ,Xslt4TaskDescription
            ,Xslt4Mail
            ,Xslt4Message
            ,Xslt4TaskRelationID
            ,EntityViewName
            ,HideIfNoPermission)
            VALUES
            (@WFTransitionSchemeID
            ,@WFSchemeID
            ,@TransitionName
            ,@OpName
            ,@BookMarkName
            ,@WFScreenAssemblyName
            ,@WFScreenTypeName
            ,@WFInputScreenAssemblyName
            ,@WFInputScreenTypeName
            ,@WFValidatorAssemblyName
            ,@WFValidatorTypeName
            ,@CheckPermission
            ,@WFInputScreenBtnsInJSON
            ,@FromStatusID
            ,@ToStatusID
            ,@WFScreenID
            ,@RelationID
            ,@RelationText
            ,@FlagDelete
            ,@EnableBack
            ,@SortID
            ,@DWObject4ExecuteValidate
            ,@DWObject4BackValidate
            ,@DWObject4Mail
            ,@DWObject4Task
            ,@SPAfterExecute
            ,@CreateUserID
            ,@CreateDate
            ,@UpdateUserID
            ,@UpdateDate
            ,@NextWFSchemeIDS
            ,@WFExecutorScreenid
            ,@SendWFTskTo
            ,@WFTaskUserRule
            ,@Sql4EntityLoad
            ,@Xslt4TaskUrl
            ,@Xslt4TaskDescription
            ,@Xslt4Mail
            ,@Xslt4Message
            ,@Xslt4TaskRelationID
            ,@EntityViewName
            ,@HideIfNoPermission)";
            SqlCommand cmd4Insert = new SqlCommand(cmdText4Insert);
            cmd4Insert.Parameters.AddWithValue("@WFTransitionSchemeID", WFTransitionSchemeID ?? "");
            cmd4Insert.Parameters.AddWithValue("@WFSchemeID", WFSchemeID ?? "");
            cmd4Insert.Parameters.AddWithValue("@TransitionName", TransitionName ?? "");
            cmd4Insert.Parameters.AddWithValue("@OpName", OpName ?? "");
            cmd4Insert.Parameters.AddWithValue("@BookMarkName", BookMarkName ?? "");
            cmd4Insert.Parameters.AddWithValue("@WFScreenAssemblyName", WFScreenAssemblyName ?? "");
            cmd4Insert.Parameters.AddWithValue("@WFScreenTypeName", WFScreenTypeName ?? "");
            cmd4Insert.Parameters.AddWithValue("@WFInputScreenAssemblyName", WFInputScreenAssemblyName ?? "");
            cmd4Insert.Parameters.AddWithValue("@WFInputScreenTypeName", WFInputScreenTypeName ?? "");
            cmd4Insert.Parameters.AddWithValue("@WFValidatorAssemblyName", WFValidatorAssemblyName ?? "");
            cmd4Insert.Parameters.AddWithValue("@WFValidatorTypeName", WFValidatorTypeName ?? "");
            cmd4Insert.Parameters.AddWithValue("@CheckPermission", CheckPermission);
            cmd4Insert.Parameters.AddWithValue("@WFInputScreenBtnsInJSON", WFInputScreenBtnsInJSON ?? "");
            cmd4Insert.Parameters.AddWithValue("@FromStatusID", FromStatusID ?? "");
            cmd4Insert.Parameters.AddWithValue("@ToStatusID", ToStatusID ?? "");
            cmd4Insert.Parameters.AddWithValue("@WFScreenID", WFScreenID ?? "");
            cmd4Insert.Parameters.AddWithValue("@RelationID", RelationID ?? "");
            cmd4Insert.Parameters.AddWithValue("@RelationText", RelationText ?? "");
            cmd4Insert.Parameters.AddWithValue("@FlagDelete", FlagDelete);
            cmd4Insert.Parameters.AddWithValue("@EnableBack", EnableBack);
            cmd4Insert.Parameters.AddWithValue("@SortID", SortID);
            cmd4Insert.Parameters.AddWithValue("@DWObject4ExecuteValidate", DWObject4ExecuteValidate ?? "");
            cmd4Insert.Parameters.AddWithValue("@DWObject4BackValidate", DWObject4BackValidate ?? "");
            cmd4Insert.Parameters.AddWithValue("@DWObject4Mail", DWObject4Mail ?? "");
            cmd4Insert.Parameters.AddWithValue("@DWObject4Task", DWObject4Task ?? "");
            cmd4Insert.Parameters.AddWithValue("@SPAfterExecute", SPAfterExecute ?? "");
            cmd4Insert.Parameters.AddWithValue("@CreateUserID", CreateUserID ?? "System");
            cmd4Insert.Parameters.AddWithValue("@CreateDate", CreateDate ?? DateTime.Now);
            cmd4Insert.Parameters.AddWithValue("@UpdateUserID", UpdateUserID ?? "System");
            cmd4Insert.Parameters.AddWithValue("@UpdateDate", UpdateDate ?? DateTime.Now);
            cmd4Insert.Parameters.AddWithValue("@NextWFSchemeIDS", NextWFSchemeIDS ?? "");
            cmd4Insert.Parameters.AddWithValue("@WFExecutorScreenid", WFExecutorScreenid ?? "");
            cmd4Insert.Parameters.AddWithValue("@SendWFTskTo", SendWFTskTo ?? "");
            cmd4Insert.Parameters.AddWithValue("@WFTaskUserRule", WFTaskUserRule ?? "");
            cmd4Insert.Parameters.AddWithValue("@Sql4EntityLoad", Sql4EntityLoad ?? "");
            cmd4Insert.Parameters.AddWithValue("@Xslt4TaskUrl", Xslt4TaskUrl ?? "");
            cmd4Insert.Parameters.AddWithValue("@Xslt4TaskDescription", Xslt4TaskDescription ?? "");
            cmd4Insert.Parameters.AddWithValue("@Xslt4Mail", Xslt4Mail ?? "");
            cmd4Insert.Parameters.AddWithValue("@Xslt4Message", Xslt4Message ?? "");
            cmd4Insert.Parameters.AddWithValue("@Xslt4TaskRelationID", Xslt4TaskRelationID ?? "");
            cmd4Insert.Parameters.AddWithValue("@EntityViewName", EntityViewName ?? "");
            cmd4Insert.Parameters.AddWithValue("@HideIfNoPermission", HideIfNoPermission ?? 0);
            int iresult = FxDBUtility.ExecuteNonQuery(new SqlCommand[] { cmd4Delete, cmd4Insert });
            JsonResult jr = new JsonResult(new { token = DateTime.Now });
            //jr.MaxJsonLength = Int32.MaxValue;
            return jr;
        }
        public async Task<IActionResult> OnGetFxWrite2DB4WFTransitionSchemeVersion(
              string WFSchemeID
              , string WFTransitionSchemeID
              , int? Version)
        {
            string cmdText4Delete = @"DELETE FROM fxprj30wf.WFTransitionSchemeVersion WHERE WFSchemeID=@WFSchemeID AND WFTransitionSchemeID=@WFTransitionSchemeID AND Version=@Version";
            SqlCommand cmd4Delete = new SqlCommand(cmdText4Delete);
            cmd4Delete.Parameters.AddWithValue("@WFSchemeID", WFSchemeID ?? "");
            cmd4Delete.Parameters.AddWithValue("@WFTransitionSchemeID", WFTransitionSchemeID ?? "");
            cmd4Delete.Parameters.AddWithValue("@Version", Version ?? 1);
            string cmdText4Insert = @"
            INSERT INTO fxprj30wf.WFTransitionSchemeVersion
            (WFTransitionSchemeVersionID
            ,WFSchemeID
            ,WFTransitionSchemeID
            ,Version)
            VALUES
            (NEWID()
            ,@WFSchemeID
            ,@WFTransitionSchemeID
            ,@Version)";
            SqlCommand cmd4Insert = new SqlCommand(cmdText4Insert);
            cmd4Insert.Parameters.AddWithValue("@WFSchemeID", WFSchemeID ?? "");
            cmd4Insert.Parameters.AddWithValue("@WFTransitionSchemeID", WFTransitionSchemeID ?? "");
            cmd4Insert.Parameters.AddWithValue("@Version", Version ?? 1);
            int iresult = FxDBUtility.ExecuteNonQuery(new SqlCommand[] { cmd4Delete, cmd4Insert });
            JsonResult jr = new JsonResult(new { token = DateTime.Now });
            //jr.MaxJsonLength = Int32.MaxValue;
            return jr;
        }
    }
}
