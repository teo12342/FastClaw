package ai.fastclaw.app.ui

import androidx.compose.runtime.Composable
import ai.fastclaw.app.MainViewModel
import ai.fastclaw.app.ui.chat.ChatSheetContent

@Composable
fun ChatSheet(viewModel: MainViewModel) {
  ChatSheetContent(viewModel = viewModel)
}
