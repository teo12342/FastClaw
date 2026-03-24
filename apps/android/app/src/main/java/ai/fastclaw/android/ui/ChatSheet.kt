package ai.fastclaw.android.ui

import androidx.compose.runtime.Composable
import ai.fastclaw.android.MainViewModel
import ai.fastclaw.android.ui.chat.ChatSheetContent

@Composable
fun ChatSheet(viewModel: MainViewModel) {
  ChatSheetContent(viewModel = viewModel)
}
