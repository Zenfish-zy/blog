---
title: "MMDetection 自定义模型与数据集"
published: 2026-02-05
tags: [MMDetection, 目标检测, 深度学习]
category: 成长日记
description: "MMDetection 框架自定义模型组件（backbone、neck、head、loss）和数据集的详细教程"
---

# 自定义模型

我们简单地把模型的各个组件分为五类：

- 主干网络 (backbone)：通常是一个用来提取特征图 (feature map) 的全卷积网络 (FCN network)，例如：ResNet, MobileNet。
- Neck：主干网络和 Head 之间的连接部分，例如：FPN, PAFPN。
- Head：用于具体任务的组件，例如：边界框预测和掩码预测。
- 区域提取器 (roi extractor)：从特征图中提取 RoI 特征，例如：RoI Align。
- 损失 (loss)：在 Head 组件中用于计算损失的部分，例如：FocalLoss, L1Loss, GHMLoss.

## 开发新的组件

### 添加一个新的主干网络

这里，我们以 MobileNet 为例来展示如何开发新组件。

#### 1. 定义一个新的主干网络（以 MobileNet 为例）

新建一个文件 `mmdet/models/backbones/mobilenet.py`

```
import torch.nn as nn

from mmdet.registry import MODELS


@MODELS.register_module()
class MobileNet(nn.Module):

    def __init__(self, arg1, arg2):
        pass

    def forward(self, x):  # should return a tuple
        pass
```



#### 2. 导入该模块

你可以添加下述代码到 `mmdet/models/backbones/__init__.py`

```
from .mobilenet import MobileNet
```



或添加：

```
custom_imports = dict(
    imports=['mmdet.models.backbones.mobilenet'],
    allow_failed_imports=False)
```



到配置文件以避免原始代码被修改。

#### 3. 在你的配置文件中使用该主干网络

```
model = dict(
    ...
    backbone=dict(
        type='MobileNet',
        arg1=xxx,
        arg2=xxx),
    ...
```



### 添加新的 Neck

#### 1. 定义一个 Neck（以 PAFPN 为例）

新建一个文件 `mmdet/models/necks/pafpn.py`

```
import torch.nn as nn

from mmdet.registry import MODELS


@MODELS.register_module()
class PAFPN(nn.Module):

    def __init__(self,
                in_channels,
                out_channels,
                num_outs,
                start_level=0,
                end_level=-1,
                add_extra_convs=False):
        pass

    def forward(self, inputs):
        # implementation is ignored
        pass
```



#### 2. 导入该模块

你可以添加下述代码到 `mmdet/models/necks/__init__.py`

```
from .pafpn import PAFPN
```



或添加：

```
custom_imports = dict(
    imports=['mmdet.models.necks.pafpn'],
    allow_failed_imports=False)
```



到配置文件以避免原始代码被修改。

#### 3. 修改配置文件

```
neck=dict(
    type='PAFPN',
    in_channels=[256, 512, 1024, 2048],
    out_channels=256,
    num_outs=5)
```



### 添加新的 Head

我们以 [Double Head R-CNN](https://arxiv.org/abs/1904.06493) 为例来展示如何添加一个新的 Head。

首先，添加一个新的 bbox head 到 `mmdet/models/roi_heads/bbox_heads/double_bbox_head.py`。 Double Head R-CNN 在目标检测上实现了一个新的 bbox head。为了实现 bbox head，我们需要使用如下的新模块中三个函数。

```
from typing import Tuple

import torch.nn as nn
from mmcv.cnn import ConvModule
from mmengine.model import BaseModule, ModuleList
from torch import Tensor

from mmdet.models.backbones.resnet import Bottleneck
from mmdet.registry import MODELS
from mmdet.utils import ConfigType, MultiConfig, OptConfigType, OptMultiConfig
from .bbox_head import BBoxHead


@MODELS.register_module()
class DoubleConvFCBBoxHead(BBoxHead):
    r"""Bbox head used in Double-Head R-CNN

    .. code-block:: none

                                          /-> cls
                      /-> shared convs ->
                                          \-> reg
        roi features
                                          /-> cls
                      \-> shared fc    ->
                                          \-> reg
    """  # noqa: W605

    def __init__(self,
                 num_convs: int = 0,
                 num_fcs: int = 0,
                 conv_out_channels: int = 1024,
                 fc_out_channels: int = 1024,
                 conv_cfg: OptConfigType = None,
                 norm_cfg: ConfigType = dict(type='BN'),
                 init_cfg: MultiConfig = dict(
                     type='Normal',
                     override=[
                         dict(type='Normal', name='fc_cls', std=0.01),
                         dict(type='Normal', name='fc_reg', std=0.001),
                         dict(
                             type='Xavier',
                             name='fc_branch',
                             distribution='uniform')
                     ]),
                 **kwargs) -> None:
        kwargs.setdefault('with_avg_pool', True)
        super().__init__(init_cfg=init_cfg, **kwargs)

    def forward(self, x_cls: Tensor, x_reg: Tensor) -> Tuple[Tensor]:
```



然后，如有必要，实现一个新的 bbox head。我们打算从 `StandardRoIHead` 来继承新的 `DoubleHeadRoIHead`。我们可以发现 `StandardRoIHead` 已经实现了下述函数。

```
from typing import List, Optional, Tuple

import torch
from torch import Tensor

from mmdet.registry import MODELS, TASK_UTILS
from mmdet.structures import DetDataSample
from mmdet.structures.bbox import bbox2roi
from mmdet.utils import ConfigType, InstanceList
from ..task_modules.samplers import SamplingResult
from ..utils import empty_instances, unpack_gt_instances
from .base_roi_head import BaseRoIHead


@MODELS.register_module()
class StandardRoIHead(BaseRoIHead):
    """Simplest base roi head including one bbox head and one mask head."""

    def init_assigner_sampler(self) -> None:

    def init_bbox_head(self, bbox_roi_extractor: ConfigType,
                       bbox_head: ConfigType) -> None:

    def init_mask_head(self, mask_roi_extractor: ConfigType,
                       mask_head: ConfigType) -> None:

    def forward(self, x: Tuple[Tensor],
                rpn_results_list: InstanceList) -> tuple:

    def loss(self, x: Tuple[Tensor], rpn_results_list: InstanceList,
             batch_data_samples: List[DetDataSample]) -> dict:

    def _bbox_forward(self, x: Tuple[Tensor], rois: Tensor) -> dict:

    def bbox_loss(self, x: Tuple[Tensor],
                  sampling_results: List[SamplingResult]) -> dict:

    def mask_loss(self, x: Tuple[Tensor],
                  sampling_results: List[SamplingResult], bbox_feats: Tensor,
                  batch_gt_instances: InstanceList) -> dict:

    def _mask_forward(self,
                      x: Tuple[Tensor],
                      rois: Tensor = None,
                      pos_inds: Optional[Tensor] = None,
                      bbox_feats: Optional[Tensor] = None) -> dict:

    def predict_bbox(self,
                     x: Tuple[Tensor],
                     batch_img_metas: List[dict],
                     rpn_results_list: InstanceList,
                     rcnn_test_cfg: ConfigType,
                     rescale: bool = False) -> InstanceList:

    def predict_mask(self,
                     x: Tuple[Tensor],
                     batch_img_metas: List[dict],
                     results_list: InstanceList,
                     rescale: bool = False) -> InstanceList:
```



Double Head 的修改主要在 bbox_forward 的逻辑中，且它从 `StandardRoIHead` 中继承了其他逻辑。在 `mmdet/models/roi_heads/double_roi_head.py` 中，我们用下述代码实现新的 bbox head：

```
from typing import Tuple

from torch import Tensor

from mmdet.registry import MODELS
from .standard_roi_head import StandardRoIHead


@MODELS.register_module()
class DoubleHeadRoIHead(StandardRoIHead):
    """RoI head for `Double Head RCNN <https://arxiv.org/abs/1904.06493>`_.

    Args:
        reg_roi_scale_factor (float): The scale factor to extend the rois
            used to extract the regression features.
    """

    def __init__(self, reg_roi_scale_factor: float, **kwargs):
        super().__init__(**kwargs)
        self.reg_roi_scale_factor = reg_roi_scale_factor

    def _bbox_forward(self, x: Tuple[Tensor], rois: Tensor) -> dict:
        """Box head forward function used in both training and testing.

        Args:
            x (tuple[Tensor]): List of multi-level img features.
            rois (Tensor): RoIs with the shape (n, 5) where the first
                column indicates batch id of each RoI.

        Returns:
             dict[str, Tensor]: Usually returns a dictionary with keys:

                - `cls_score` (Tensor): Classification scores.
                - `bbox_pred` (Tensor): Box energies / deltas.
                - `bbox_feats` (Tensor): Extract bbox RoI features.
        """
        bbox_cls_feats = self.bbox_roi_extractor(
            x[:self.bbox_roi_extractor.num_inputs], rois)
        bbox_reg_feats = self.bbox_roi_extractor(
            x[:self.bbox_roi_extractor.num_inputs],
            rois,
            roi_scale_factor=self.reg_roi_scale_factor)
        if self.with_shared_head:
            bbox_cls_feats = self.shared_head(bbox_cls_feats)
            bbox_reg_feats = self.shared_head(bbox_reg_feats)
        cls_score, bbox_pred = self.bbox_head(bbox_cls_feats, bbox_reg_feats)

        bbox_results = dict(
            cls_score=cls_score,
            bbox_pred=bbox_pred,
            bbox_feats=bbox_cls_feats)
        return bbox_results
```



最终，用户需要把该模块添加到 `mmdet/models/bbox_heads/__init__.py` 和 `mmdet/models/roi_heads/__init__.py` 以使相关的注册表可以找到并加载他们。

或者，用户可以添加：

```
custom_imports=dict(
    imports=['mmdet.models.roi_heads.double_roi_head', 'mmdet.models.roi_heads.bbox_heads.double_bbox_head'])
```



到配置文件并实现相同的目的。

Double Head R-CNN 的配置文件如下：

```
_base_ = '../faster_rcnn/faster-rcnn_r50_fpn_1x_coco.py'
model = dict(
    roi_head=dict(
        type='DoubleHeadRoIHead',
        reg_roi_scale_factor=1.3,
        bbox_head=dict(
            _delete_=True,
            type='DoubleConvFCBBoxHead',
            num_convs=4,
            num_fcs=2,
            in_channels=256,
            conv_out_channels=1024,
            fc_out_channels=1024,
            roi_feat_size=7,
            num_classes=80,
            bbox_coder=dict(
                type='DeltaXYWHBBoxCoder',
                target_means=[0., 0., 0., 0.],
                target_stds=[0.1, 0.1, 0.2, 0.2]),
            reg_class_agnostic=False,
            loss_cls=dict(
                type='CrossEntropyLoss', use_sigmoid=False, loss_weight=2.0),
            loss_bbox=dict(type='SmoothL1Loss', beta=1.0, loss_weight=2.0))))
```



从 MMDetection 2.0 版本起，配置系统支持继承配置以使用户可以专注于修改。 Double Head R-CNN 主要使用了一个新的 `DoubleHeadRoIHead` 和一个新的 `DoubleConvFCBBoxHead`，参数需要根据每个模块的 `__init__` 函数来设置。

### 添加新的损失

假设你想添加一个新的损失 `MyLoss` 用于边界框回归。 为了添加一个新的损失函数，用户需要在 `mmdet/models/losses/my_loss.py` 中实现。 装饰器 `weighted_loss` 可以使损失每个部分加权。

```
import torch
import torch.nn as nn

from mmdet.registry import LOSSES
from .utils import weighted_loss


@weighted_loss
def my_loss(pred, target):
    assert pred.size() == target.size() and target.numel() > 0
    loss = torch.abs(pred - target)
    return loss

@LOSSES.register_module()
class MyLoss(nn.Module):

    def __init__(self, reduction='mean', loss_weight=1.0):
        super(MyLoss, self).__init__()
        self.reduction = reduction
        self.loss_weight = loss_weight

    def forward(self,
                pred,
                target,
                weight=None,
                avg_factor=None,
                reduction_override=None):
        assert reduction_override in (None, 'none', 'mean', 'sum')
        reduction = (
            reduction_override if reduction_override else self.reduction)
        loss_bbox = self.loss_weight * my_loss(
            pred, target, weight, reduction=reduction, avg_factor=avg_factor)
        return loss_bbox
```



然后，用户需要把它加到 `mmdet/models/losses/__init__.py`。

```
from .my_loss import MyLoss, my_loss
```



或者，你可以添加：

```
custom_imports=dict(
    imports=['mmdet.models.losses.my_loss'])
```



到配置文件来实现相同的目的。

如使用，请修改 `loss_xxx` 字段。 因为 MyLoss 是用于回归的，你需要在 Head 中修改 `loss_xxx` 字段。

```
loss_bbox=dict(type='MyLoss', loss_weight=1.0))
```

# 自定义损失函数

MMDetection 为用户提供了不同的损失函数。但是默认的配置可能无法适应不同的数据和模型，所以用户可能会希望修改某一个损失函数来适应新的情况。

本教程首先详细的解释计算损失的过程然后给出一些关于如何修改每一个步骤的指导。对损失的修改可以被分为微调和加权。

## 一个损失的计算过程

给定输入（包括预测和目标，以及权重），损失函数会把输入的张量映射到最后的损失标量。映射过程可以分为下面五个步骤：

1. 设置采样方法为对正负样本进行采样。
2. 通过损失核函数获取**元素**或者**样本**损失。
3. 通过权重张量来给损失**逐元素**权重。
4. 把损失张量归纳为一个**标量**。
5. 用一个**张量**给当前损失一个权重。

## 设置采样方法（步骤 1）

对于一些损失函数，需要采样策略来避免正负样本之间的不平衡。

例如，在RPN head中使用`CrossEntropyLoss`时，我们需要在`train_cfg`中设置`RandomSampler`

```
train_cfg=dict(
    rpn=dict(
        sampler=dict(
            type='RandomSampler',
            num=256,
            pos_fraction=0.5,
            neg_pos_ub=-1,
            add_gt_as_proposals=False))
```



对于其他一些具有正负样本平衡机制的损失，例如 Focal Loss、GHMC 和 QualityFocalLoss，不再需要进行采样。

## 微调损失

微调一个损失主要与步骤 2，4，5 有关，大部分的修改可以在配置文件中指定。这里我们用 [Focal Loss (FL)](https://github.com/open-mmlab/mmdetection/blob/main/mmdet/models/losses/focal_loss.py) 作为例子。 下面的代码分别是构建 FL 的方法和它的配置文件，他们是一一对应的。

```
@LOSSES.register_module()
class FocalLoss(nn.Module):

    def __init__(self,
                 use_sigmoid=True,
                 gamma=2.0,
                 alpha=0.25,
                 reduction='mean',
                 loss_weight=1.0):
```



```
loss_cls=dict(
    type='FocalLoss',
    use_sigmoid=True,
    gamma=2.0,
    alpha=0.25,
    loss_weight=1.0)
```



### 微调超参数（步骤2）

`gamma` 和 `beta` 是 Focal Loss 中的两个超参数。如果我们想把 `gamma` 的值设为 1.5，把 `alpha` 的值设为 0.5，我们可以在配置文件中按照如下指定：

```
loss_cls=dict(
    type='FocalLoss',
    use_sigmoid=True,
    gamma=1.5,
    alpha=0.5,
    loss_weight=1.0)
```



### 微调归纳方式（步骤4）

Focal Loss 默认的归纳方式是 `mean`。如果我们想把归纳方式从 `mean` 改成 `sum`，我们可以在配置文件中按照如下指定：

```
loss_cls=dict(
    type='FocalLoss',
    use_sigmoid=True,
    gamma=2.0,
    alpha=0.25,
    loss_weight=1.0,
    reduction='sum')
```



### 微调损失权重（步骤5）

这里的损失权重是一个标量，他用来控制多任务学习中不同损失的重要程度，例如，分类损失和回归损失。如果我们想把分类损失的权重设为 0.5，我们可以在配置文件中如下指定：

```
loss_cls=dict(
    type='FocalLoss',
    use_sigmoid=True,
    gamma=2.0,
    alpha=0.25,
    loss_weight=0.5)
```



## 加权损失（步骤3）

加权损失就是我们逐元素修改损失权重。更具体来说，我们给损失张量乘以一个与他有相同形状的权重张量。所以，损失中不同的元素可以被赋予不同的比例，所以这里叫做逐元素。损失的权重在不同模型中变化很大，而且与上下文相关，但是总的来说主要有两种损失权重：分类损失的 `label_weights` 和边界框的 `bbox_weights`。你可以在相应的头中的 `get_target` 方法中找到他们。这里我们使用 [ATSSHead](https://github.com/open-mmlab/mmdetection/blob/main/mmdet/models/dense_heads/atss_head.py#L322) 作为一个例子。它继承了 [AnchorHead](https://github.com/open-mmlab/mmdetection/blob/main/mmdet/models/dense_heads/anchor_head.py) ，但是我们重写它的 `get_targets` 方法来产生不同的 `label_weights` 和 `bbox_weights`。

```
class ATSSHead(AnchorHead):

    ...

    def get_targets(self,
                    anchor_list,
                    valid_flag_list,
                    gt_bboxes_list,
                    img_metas,
                    gt_bboxes_ignore_list=None,
                    gt_labels_list=None,
                    label_channels=1,
                    unmap_outputs=True):
```

# 自定义数据集

## 支持新的数据格式

为了支持新的数据格式，可以选择将数据转换成现成的格式（COCO 或者 PASCAL）或将其转换成中间格式。当然也可以选择以离线的形式（在训练之前使用脚本转换）或者在线的形式（实现一个新的 dataset 在训练中进行转换）来转换数据。

在 MMDetection 中，建议将数据转换成 COCO 格式并以离线的方式进行，因此在完成数据转换后只需修改配置文件中的标注数据的路径和类别即可。

### 将新的数据格式转换为现有的数据格式

最简单的方法就是将你的数据集转换成现有的数据格式（COCO 或者 PASCAL VOC）

COCO 格式的 JSON 标注文件有如下必要的字段：

```
'images': [
    {
        'file_name': 'COCO_val2014_000000001268.jpg',
        'height': 427,
        'width': 640,
        'id': 1268
    },
    ...
],

'annotations': [
    {
        'segmentation': [[192.81,
            247.09,
            ...
            219.03,
            249.06]],  # 如果有 mask 标签且为多边形 XY 点坐标格式，则需要保证至少包括 3 个点坐标，否则为无效多边形
        'area': 1035.749,
        'iscrowd': 0,
        'image_id': 1268,
        'bbox': [192.81, 224.8, 74.73, 33.43],
        'category_id': 16,
        'id': 42986
    },
    ...
],

'categories': [
    {'id': 0, 'name': 'car'},
 ]
```



在 JSON 文件中有三个必要的键：

- `images`: 包含多个图片以及它们的信息的数组，例如 `file_name`、`height`、`width` 和 `id`。
- `annotations`: 包含多个实例标注信息的数组。
- `categories`: 包含多个类别名字和 ID 的数组。

在数据预处理之后，使用现有的数据格式来训练自定义的新数据集有如下两步（以 COCO 为例）：

1. 为自定义数据集修改配置文件。
2. 检查自定义数据集的标注。

这里我们举一个例子来展示上面的两个步骤，这个例子使用包括 5 个类别的 COCO 格式的数据集来训练一个现有的 Cascade Mask R-CNN R50-FPN 检测器

#### 1. 为自定义数据集修改配置文件

配置文件的修改涉及两个方面：

1. `dataloaer` 部分。需要在 `train_dataloader.dataset`、`val_dataloader.dataset` 和 `test_dataloader.dataset` 中添加 `metainfo=dict(classes=classes)`, 其中 classes 必须是 tuple 类型。
2. `model` 部分中的 `num_classes`。需要将默认值（COCO 数据集中为 80）修改为自定义数据集中的类别数。

`configs/my_custom_config.py` 内容如下：

```
# 新的配置来自基础的配置以更好地说明需要修改的地方
_base_ = './cascade_mask_rcnn_r50_fpn_1x_coco.py'

# 1. 数据集设定
dataset_type = 'CocoDataset'
classes = ('a', 'b', 'c', 'd', 'e')
data_root='path/to/your/'

train_dataloader = dict(
    batch_size=2,
    num_workers=2,
    dataset=dict(
        type=dataset_type,
        # 将类别名字添加至 `metainfo` 字段中
        metainfo=dict(classes=classes),
        data_root=data_root,
        ann_file='train/annotation_data',
        data_prefix=dict(img='train/image_data')
        )
    )

val_dataloader = dict(
    batch_size=1,
    num_workers=2,
    dataset=dict(
        type=dataset_type,
        test_mode=True,
        # 将类别名字添加至 `metainfo` 字段中
        metainfo=dict(classes=classes),
        data_root=data_root,
        ann_file='val/annotation_data',
        data_prefix=dict(img='val/image_data')
    )

test_dataloader = dict(
    batch_size=1,
    num_workers=2,
    dataset=dict(
        type=dataset_type,
        test_mode=True,
        # 将类别名字添加至 `metainfo` 字段中
        metainfo=dict(classes=classes),
        data_root=data_root,
        ann_file='test/annotation_data',
        data_prefix=dict(img='test/image_data')
        )
    )

# 2. 模型设置

# 将所有的 `num_classes` 默认值修改为 5（原来为80）
model = dict(
    roi_head=dict(
        bbox_head=[
            dict(
                type='Shared2FCBBoxHead',
                # 将所有的 `num_classes` 默认值修改为 5（原来为 80）
                num_classes=5),
            dict(
                type='Shared2FCBBoxHead',
                # 将所有的 `num_classes` 默认值修改为 5（原来为 80）
                num_classes=5),
            dict(
                type='Shared2FCBBoxHead',
                # 将所有的 `num_classes` 默认值修改为 5（原来为 80）
                num_classes=5)],
    # 将所有的 `num_classes` 默认值修改为 5（原来为 80）
    mask_head=dict(num_classes=5)))
```



#### 2. 检查自定义数据集的标注

假设你自己的数据集是 COCO 格式，那么需要保证数据的标注没有问题：

1. 标注文件中 `categories` 的长度要与配置中的 `classes` 元组长度相匹配，它们都表示有几类。（如例子中有 5 个类别）
2. 配置文件中 `classes` 字段应与标注文件里 `categories` 下的 `name` 有相同的元素且顺序一致。MMDetection 会自动将 `categories` 中不连续的 `id` 映射成连续的索引，因此 `categories` 下的 `name`的字符串顺序会影响标签的索引。同时，配置文件中的 `classes` 的字符串顺序也会影响到预测框可视化时的标签。
3. `annotations` 中的 `category_id` 必须是有效的值。比如所有 `category_id` 的值都应该属于 `categories` 中的 `id`。

下面是一个有效标注的例子：

```
'annotations': [
    {
        'segmentation': [[192.81,
            247.09,
            ...
            219.03,
            249.06]],  # 如果有 mask 标签。
        'area': 1035.749,
        'iscrowd': 0,
        'image_id': 1268,
        'bbox': [192.81, 224.8, 74.73, 33.43],
        'category_id': 16,
        'id': 42986
    },
    ...
],

# MMDetection 会自动将 `categories` 中不连续的 `id` 映射成连续的索引。
'categories': [
    {'id': 1, 'name': 'a'}, {'id': 3, 'name': 'b'}, {'id': 4, 'name': 'c'}, {'id': 16, 'name': 'd'}, {'id': 17, 'name': 'e'},
 ]
```



我们使用这种方式来支持 CityScapes 数据集。脚本在 [cityscapes.py](https://github.com/open-mmlab/mmdetection/blob/main/tools/dataset_converters/cityscapes.py) 并且我们提供了微调的 [configs](https://github.com/open-mmlab/mmdetection/blob/main/configs/cityscapes).

**注意**

1. 对于实例分割数据集, **MMDetection 目前只支持评估 COCO 格式的 mask AP**.
2. 推荐训练之前进行离线转换，这样就可以继续使用 `CocoDataset` 且只需修改标注文件的路径以及训练的种类。
